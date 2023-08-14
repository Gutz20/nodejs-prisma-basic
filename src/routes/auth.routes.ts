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
import { verifyUser } from "../middlewares/auth";

const router = express.Router();

router.get("/verifyOTP", verifyOTP); // verify generated OTP
router.get("/generateOTP", generateOTP); // generate random OTP
router.get("/createResetSession", createResetSession); // reset all the variables
router.get("/profile", profile); // Maybe this is not util

router.post("/register", register); // register user
router.post("/registerMail", registerMail); // Send the email
router.post("/authenticate", authenticate); // Authenticate user

// La verificacion del usuario se hace dentro del login por lo cual el middleware esta demás creo
router.post("/login", verifyUser, login); // login in app

router.post("/logout", logout); // logout in app

router.put("/resetPassword", resetPassword); // Use to reset password

export default router;
