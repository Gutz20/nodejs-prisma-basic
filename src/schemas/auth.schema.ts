import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";

export const registerSchema = z.object({
  username: z.string({
    required_error: "Username is required",
  }),
  email: z.string({
    required_error: "Email is required",
  }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters",
    }),
});

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Email is not valid",
    }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters",
    }),
});

export interface MyRequest<
  ReqBody = any,
  ReqParams = any,
  ReqQuery = any,
  ResBody = any,
  Locals extends Record<string, any> = any
> extends Request<ReqParams, ResBody, ReqBody, ReqQuery, Locals> {
  user?: string | jwt.JwtPayload;
  cookies: {
    jwt: string;
  };
}
