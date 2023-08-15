import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../db/db";
import { MyRequest } from "../schemas/auth.schema";
import { User } from "@prisma/client";

// Verifica que el usuario exista
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req.method === "GET" ? req.query : req.body;

    const exist = await prisma.user.findUnique({ where: { username } });
    if (!exist) return res.status(404).send({ error: "Can't find User!" });

    next();
  } catch (error) {
    return res.status(404).send({ error: "Authentication Error" });
  }
};

// Verifica el token de la cookie
export const verifyToken = async (
  req: MyRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt;
    const user = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = user as User;
    next();
  } catch (error) {
    return res.status(404).send({ error: "" });
  }
};

export const authBearerToken = async (
  req: MyRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // access authorize header to validate request
    const token = req.headers.authorization?.split(" ")[1];

    // retrive the user details to the logged in user
    const decodedToken = await jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    );

    req.user = decodedToken;

    next();
  } catch (error) {
    return res.status(401).send({ error: "Authentication Failed" });
  }
};

export const localVariables = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
};
