import { Request, Response } from "express";
import { User } from "@prisma/client";
import { prisma } from "../../db/db";
import { MyRequest } from "../../schemas/auth.schema";

export const getAll = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json(users);
  } catch (error) {
    return res.status(404).send({ error: "Can't find users" });
  }
};

export const getById = async (req: Request, res: Response) => {
  return res.status(201).send("User by id");
};

export const getByUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    // This maybe resolver with zod schema
    if (!username) return res.status(501).send({ error: "Invalid" });

    const userFound: User | null = await prisma.user.findUnique({
      where: { username },
    });

    if (!userFound)
      return res.status(501).send({ error: "Couldn't find the user" });

    const { password, ...user } = userFound;

    return res.status(201).send(user);
  } catch (error) {
    return res.status(404).send({ error: "Can't find the user data" });
  }
};

export const create = async (req: Request, res: Response) => {};

export const update = async (req: any, res: Response) => {
  try {
    const { id } = req.user;

    const userUpdated = await prisma.user.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: req.body,
    });

    return res.json(userUpdated);
  } catch (error) {
    return res.status(40).send({ error });
  }
};
