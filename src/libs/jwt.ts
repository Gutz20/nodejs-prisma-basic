import jwt from "jsonwebtoken";

export function createAccessToken(payload: string | object | Buffer) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      { expiresIn: 60 * 60 * 24 },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
}
