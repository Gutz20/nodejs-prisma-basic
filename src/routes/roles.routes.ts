import express from "express";
import { requireAuth } from "../middlewares/requireAuth";
import {
  getAll,
  getById,
  create,
  update,
  eliminate,
} from "../controllers/roles";

const router = express.Router();
router.use(requireAuth);

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", eliminate);

export default router;
