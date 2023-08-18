import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { Rol, User } from "@prisma/client";
import { prisma } from "../../db/db";
import { createAccessToken } from "../../libs/jwt";
import sendEmail from "../../helpers/mailer";

export const getAll = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({ include: { roles: true } });

    res.status(200).json(users);
  } catch (error) {
    return res.status(404).send({ error: "Can't find users" });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userFound = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        roles: true,
      },
    });

    if (!userFound) return res.status(404).json({ msg: "User not found" });

    return res.status(200).json(userFound);
  } catch (error) {
    return res.status(400).send({ error });
  }
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

export const create = async (req: Request, res: Response) => {
  // try {
  //   const { username, password, email, roles } = req.body;
  //   const foundUserEmail = await prisma.user.findUnique({
  //     where: { email: email },
  //   });
  //   if (foundUserEmail) return res.status(400).json("Email already exits");
  //   const foundUserUsername = await prisma.user.findUnique({
  //     where: { username: username },
  //   });
  //   if (foundUserUsername)
  //     return res.status(400).json("Username already exits");
  //   const passwordHash = await bcrypt.hash(password, 10);
  //   const rolesToAdd = await prisma.rol.findMany({
  //     where: {
  //       name: {
  //         in: roles,
  //       },
  //     },
  //   });
  //   const newUser = await prisma.user.create({
  //     data: {
  //       email,
  //       username,
  //       password: passwordHash,
  //       roles: { connect: rolesToAdd.map((role) => ({ id: role.id })) },
  //     },
  //   });
  //   const tokenCreated = await createAccessToken({ email: newUser.email });
  //   const token = await prisma.token.create({
  //     data: { userId: newUser.id, token: tokenCreated as string },
  //   });
  //   const message = `${process.env.BASE_URL}/api/auth/verify/${newUser.id}/${token.token}`;
  //   await sendEmail({
  //     username: newUser.username,
  //     text: message,
  //     to: newUser.email,
  //     subject: "Verify email",
  //   });
  //   res.status(201).send({ msg: "User Register Successfull" });
  // } catch (error) {
  //   return res.status(400).send({ error });
  // }
};

export const update = async (req: Request, res: Response) => {
  // try {
  //   const { id } = req.params;
  //   const { username, email, password, roles } = req.body;
  //   const userFound = await prisma.user.findUniqueOrThrow({
  //     where: {
  //       id: parseInt(id),
  //     },
  //     include: { roles: true },
  //   });
  //   if (!userFound) return res.status(400).send({ error: "User not found" });
  //   const rolesToAdd = await prisma.rol.findMany({
  //     where: {
  //       name: {
  //         in: roles,
  //       },
  //     },
  //   });
  //   const existingRoleIds = userFound.roles.map((role) => ({ id: role.id }));
  //   const userUpdated = await prisma.user.update({
  //     where: {
  //       id: userFound.id,
  //     },
  //     data: {
  //       email: email,
  //       username: username,
  //       password: password,
  //       roles: {
  //         disconnect: existingRoleIds,
  //         connect: rolesToAdd.map((role) => ({ id: role.id })),
  //       },
  //     },
  //   });
  //   return res.status(200).json(userUpdated);
  // } catch (error) {
  //   return res.status(400).send({ error });
  // }
};

export const eliminate = async (req: Request, res: Response) => {
  const { id } = req.params;

  const userDeleted = await prisma.user.delete({
    where: {
      id: parseInt(id),
    },
  });

  if (!userDeleted) return res.status(404).json({ error: "User not found" });

  return res.json(userDeleted);
  try {
  } catch (error) {
    return res.status(400).send({ error });
  }
};
