import { Request, Response } from "express";
import { prisma } from "../../db/db";

export const getAll = async (req: Request, res: Response) => {
  try {
    const roles = await prisma.rol.findMany();
    res.send(roles);
  } catch (error) {
    res.status(404).json({ error });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rolFound = await prisma.rol.findUnique({
      where: { id: parseInt(id) },
    });

    if (!rolFound) return res.status(404).send({ error: "Rol not Found" });

    return res.json(rolFound);
  } catch (error) {
    res.status(404).json({ error });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const rolCreated = await prisma.rol.create({
      data: req.body,
    });

    return res.status(201).json({ data: rolCreated, msg: "Rol created" });
  } catch (error) {
    res.status(404).json({ error });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const rolFound = await prisma.rol.findUnique({
      where: { id: parseInt(id) },
    });

    if (!rolFound) return res.status(400).send({ error: "Rol not found" });
    const rolUpdated = await prisma.rol.update({
      where: {
        id: parseInt(id),
      },
      data: req.body,
    });

    return res.json(rolUpdated);
  } catch (error) {
    return res.status(400).send({ error });
  }
};

export const eliminate = async (req: Request, res: Response) => {
  try {
    const rolDeleted = await prisma.rol.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!rolDeleted) return res.status(404).json({ error: "Rol not found" });

    return res.json(rolDeleted);
  } catch (error) {
    return res.status(400).send({ error });
  }
};
