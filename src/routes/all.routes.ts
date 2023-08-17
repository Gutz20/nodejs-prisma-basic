import express from "express";
import authRoutes from "./auth.routes";
import plansRoutes from "./plans.routes";
import usersRoutes from "./users.routes";
import postsRoutes from "./posts.routes";
import rolesRoutes from "./roles.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/plans", plansRoutes);
router.use("/users", usersRoutes);
router.use("/posts", postsRoutes);
router.use("/roles", rolesRoutes);

export default router;
