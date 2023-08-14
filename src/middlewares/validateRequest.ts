import { NextFunction, Response, Request } from "express";
import { AnyZodObject } from "zod";

// Validate the schema of zod
export const validateRequest = (schema: AnyZodObject) => {
  return (req: Request, _: Response, next: NextFunction) => {
    schema.parse({ body: req.body, params: req.params, query: req.query });
    next();
  };
};
