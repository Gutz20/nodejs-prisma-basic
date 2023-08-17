import express from "express";
import { create, getAll, getById, update } from "../controllers/products";
import { requireAuth } from "../middlewares/requireAuth";

const router = express.Router();

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", create);
router.put("/:id", update);

export default router;
