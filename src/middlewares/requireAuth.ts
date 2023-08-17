import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../db/db";

export const verifyUserAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userFound = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    if (!userFound) return res.status(400).json({ message: "User not found" });

    if (!userFound.verified)
      return res.status(403).json({ message: "User is not verified" });

    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({
      message: "Unauthorized",
    });

  const token = authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({
      message: "Unauthorized",
    });

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err)
      return res.status(401).json({
        message: "Unauthorized",
      });

    req.user = user;
    next();
  });
};
