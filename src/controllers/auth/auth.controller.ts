import bcrypt from "bcrypt";
import { Request, Response } from "express";
import otpGenerator from "otp-generator";
import { prisma } from "../../db/db";
import { sendEmail } from "../../helpers/mailer";
import { createAccessToken } from "../../libs/jwt";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, profile, email } = req.body;

    // Verify if the user exists
    const existUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existUsername)
      return res.status(400).json({ error: "Username already in use" });

    const existEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // Verify if the email exists
    if (existEmail)
      return res.status(400).json({ error: "Email already exits" });

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { username: username, email: email, password: passwordHash },
    });

    const tokenCreated = await createAccessToken({ email: newUser.email });
    const token = await prisma.token.create({
      data: { userId: newUser.id, token: tokenCreated as string },
    });

    const message = `${process.env.BASE_URL}/api/auth/verify/${newUser.id}/${token.token}`;

    await sendEmail({
      username: newUser.username,
      text: message,
      to: newUser.email,
      subject: "Verify email",
    });

    // res.status(201).send(newUser);
    res.status(201).send({
      msg: "User Register Successfull and a email sent to your account",
    });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const userFound = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!userFound) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch)
      return res.status(400).json({ message: "Incorrect Password" });

    const token = await createAccessToken({
      id: userFound.id,
      email: userFound.email,
    });

    return res.status(200).send({
      msg: "Login Successful...!",
      email: userFound?.email,
      token,
    });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

export const registerMail = async (req: Request, res: Response) => {
  try {
    console.log("Dentro del registerMail");

    const { id, token } = req.params;
    const userFound = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!userFound) return res.status(400).send("Invalid Link");

    const tokenFound = await prisma.token.findUnique({
      where: { userId: parseInt(id), token: token },
    });

    if (!tokenFound) return res.status(400).send("Invalid Link");

    await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: { verified: true },
    });

    await prisma.token.delete({
      where: { id: tokenFound.id },
    });

    res.send("Email verified Sucessfully");
  } catch (error) {
    res.status(400).send({ msg: error });
  }
};

export const authenticate = async (req: Request, res: Response) => {
  res.end();
};

/* Generates a 6-digit key and stores it in locals */
export const generateOTP = async (req: Request, res: Response) => {
  req.app.locals.OTP = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  res.status(201).send({ code: req.app.locals.OTP });
};

export const verifyOTP = async (req: Request, res: Response) => {
  const { code } = req.query;

  if (parseInt(req.app.locals.OTP) === parseInt(code as string)) {
    req.app.locals.OTP = null; // Reset the OTP value
    req.app.locals.resetSession = true; // Start session for reset password
    return res.status(201).send({ msg: "Verify successfully!" });
  }
  return res.status(400).send({ error: "Invalid OTP" });
};

/* Redirect user when OTP is valid */
export const createResetSession = async (req: Request, res: Response) => {
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false; // allow access to this route only once
    return res.status(201).send({ msg: "Access Granted!" });
  }
  return res.status(440).send({ error: "Session expired!" });
};

/* Update the password when we have valid session */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    if (!req.app.locals.resetSession)
      return res.status(440).send({ error: "Session expired!" });

    const { username, password } = req.body;

    const userFound = await prisma.user.findUnique({ where: { username } });

    if (!userFound)
      return res.status(404).send({ error: "Username not Found" });

    const passwordHashed = await bcrypt.hash(password, 10);

    const userUpdated = await prisma.user.update({
      where: {
        username,
      },
      data: { username, password: passwordHashed },
    });

    if (!userUpdated)
      return res.status(404).send({ error: "Error updating the user" });

    req.app.locals.resetSession = false;

    return res.status(201).send({ msg: "Record Updated...!" });
  } catch (error) {
    return res.status(401).send({ error });
  }
};

export const logout = async (req: Request, res: Response) => {};

export const profile = async (req: Request, res: Response) => {
  // return res.json({ profile: req.user, message: "Profile data" });
  try {
    const userFound = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        roles: true,
      },
    });

    if (!userFound) return res.status(404).json({ message: "User not found" });

    const profileData = {
      firstName: userFound.firstName,
      lastName: userFound.lastName,
      phone: userFound.mobile,
      email: userFound.email,
      address: userFound.address,
      roles: userFound.roles,
    };

    return res.json({ data: profileData, message: "Profile data" });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los datos" });
  }
};
