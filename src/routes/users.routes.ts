import express from "express";
import {
  create,
  getAll,
  getById,
  update,
  getByUsername,
  eliminate,
} from "../controllers/users";
import { requireAuth } from "../middlewares/requireAuth";

const router = express.Router();

router.use(requireAuth);

router.get("/", getAll);
router.get("/:id", getById);
router.get("/find/:username", getByUsername); // user with username
router.post("/", create);
router.put("/:id", update); // Is use to update the user profile
router.delete("/:id", eliminate);

export default router;
