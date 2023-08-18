import { Request, Response } from "express";
import { prisma } from "../../db/db";

export const getAll = async (req: Request, res: Response) => {
  const plans = await prisma.plan.findMany();
  return res.status(200).json(plans);
};

export const getById = async (req: Request, res: Response) => {};

export const create = async (req: Request, res: Response) => {};

export const update = async (req: Request, res: Response) => {};
