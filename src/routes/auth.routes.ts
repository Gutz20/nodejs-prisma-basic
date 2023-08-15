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

const router = express.Router();

router.get("/verifyOTP", verifyUser, verifyOTP); // verify generated OTP
router.get("/generateOTP", verifyUser, localVariables, generateOTP); // generate random OTP
router.get("/createResetSession", createResetSession); // reset all the variables
router.get("/profile", profile); // Maybe this is not util

router.post("/register", register); // register user
router.post("/registerMail", registerMail); // Send the email
router.post("/authenticate", verifyUser, authenticate); // Authenticate user

// La verificacion del usuario se hace dentro del login por lo cual el middleware esta demás creo
router.post("/login", verifyUser, login); // login in app

router.post("/logout", logout); // logout in app

router.put("/resetPassword", verifyUser, resetPassword); // Use to reset password

export default router;
