import nodemailer from "nodemailer";
import mailgen from "mailgen";
import { Request, Response } from "express";
import { MySMTPError } from "../errors/MySMTPError";

interface EmailParams {
  username: string;
  text: string;
  to: string;
  subject: string;
  html?: string;
}

const tranporter = nodemailer.createTransport({
  host: `${process.env.HOST_MAIL}`, // smtp.gmail.com
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const mailGenerator = new mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js/",
  },
});

export const sendEmail = async ({
  username,
  text,
  to,
  subject,
  html,
}: EmailParams) => {
  try {
    // const { username, userEmail, text, subject } = req.body;
    console.log({ username, text, to, subject });

    // body of the email
    const email = {
      body: {
        name: username,
        intro:
          text ||
          "Welcome to Enatel Perú! We're very excited to have you on board.",
        outro:
          "Need help, or have questions? Just reply to his email, we'd love to help",
      },
    };

    const emailBody = mailGenerator.generate(email);

    let message = {
      from: process.env.EMAIL, // Sender Address Enatel Perú <guz@enatelperu.com>
      to, // List of receivers
      subject: subject || "Signup Successfull", // Subject Line
      html: emailBody, // HTML Body
    };

    //Send Mail
    const res = await tranporter.sendMail(message);

    return { ok: true, msg: "Email enviado con exito!" };
  } catch (error) {
    throw new MySMTPError("Error al enviar el email", 500, error);
  }
};

export default sendEmail;
