import { Request, Response } from "express";
import { prisma } from "../../db/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createAccessToken } from "../../libs/jwt";
import otpGenerator from "otp-generator";
import { sendEmail } from "../../helpers/mailer";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, profile, email } = req.body;

    // Verify if the user exists
    const existUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existUsername)
      return res.status(400).json({ error: "Username already in use" });

    // Verify if the email exists
    const existEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existEmail)
      return res.status(400).json({ error: "Email already exits" });

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { username: username, email: email, password: passwordHash },
    });

    // res.status(201).send(newUser);
    res.status(201).send({ msg: "User Register Successfull" });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const userFound = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!userFound) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch)
      return res.status(400).json({ message: "Incorrect Password" });

    const token = await createAccessToken({
      id: userFound.id,
      username: userFound.username,
    });

    // Envia el token como cookie
    // res.cookie("token", token, {
    //   sameSite: "none",
    //   secure: true,
    //   httpOnly: false,
    // });

    // return res.status(200).json({
    //   id: userFound.id,
    //   username: userFound.username,
    //   email: userFound.email,
    // });

    return res.status(200).send({
      msg: "Login Successful...!",
      username: userFound?.username,
      token,
    });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

export const registerMail = async (req: Request, res: Response) => {
  const response = await sendEmail(req.body);
  res.status(200).send(response);
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

export const profile = async (req: Request, res: Response) => {};
