import express from "express";
import {
  authenticate,
  login,
  logout,
  profile,
  register,
  registerMail,
  verifyOTP,
  generateOTP,
  createResetSession,
  resetPassword,
} from "../controllers/auth";
import { verifyUser, localVariables } from "../middlewares/auth";
import { requireAuth, verifyUserAuth } from "../middlewares/requireAuth";

const router = express.Router();

router.get("/verifyOTP", verifyUser, verifyOTP); // verify generated OTP
router.get("/generateOTP", verifyUser, localVariables, generateOTP); // generate random OTP
router.get("/createResetSession", createResetSession); // reset all the variables
router.get("/verify/:id/:token", registerMail); // Send the email and register

router.post("/register", register); // register user

router.post("/authenticate", verifyUser, authenticate); // Authenticate user

// La verificacion del usuario se hace dentro del login por lo cual el middleware esta demás creo
router.post("/login", login); // login in app
router.post("/logout", requireAuth, verifyUserAuth, logout); // logout in app
router.get("/profile", requireAuth, verifyUserAuth, profile);

router.put("/resetPassword", verifyUser, resetPassword); // Use to reset password

export default router;
