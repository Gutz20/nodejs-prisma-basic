import jwt from "jsonwebtoken";

export function createAccessToken(payload: string | object | Buffer) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
}
