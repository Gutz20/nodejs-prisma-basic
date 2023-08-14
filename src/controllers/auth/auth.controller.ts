import { Request, Response } from "express";
import { prisma } from "../../db/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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

    res.status(201).send(newUser);
    // res.status(201).send({msg: "User Register Successfull"});
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
  res.json("register mail route");
};

export const authenticate = async (req: Request, res: Response) => {
  res.json("authenticate route");
};

export const generateOTP = async (req: Request, res: Response) => {
  res.json("generateOTP route");
};

export const verifyOTP = async (req: Request, res: Response) => {
  res.json("verify OTP route");
};

export const createResetSession = async (req: Request, res: Response) => {
  res.json("createResetSession route");
};

export const resetPassword = async (req: Request, res: Response) => {
  res.json("resetPassword route");
};

export const logout = async (req: Request, res: Response) => {};

export const profile = async (req: Request, res: Response) => {};
