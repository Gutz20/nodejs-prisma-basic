import express from "express";
import {
  create,
  getAll,
  getById,
  update,
  getByUsername,
} from "../controllers/users";
import { authBearerToken } from "../middlewares/auth";

const router = express.Router();

router.get("/", getAll);
router.get("/:id", getById);
router.get("/find/:username", getByUsername); // user with username
router.post("/", create);
router.put("/:id", authBearerToken, update); // Is use to update the user profile

export default router;
