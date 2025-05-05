import express from "express";
import {
  reigesterpage,
  register,
  login,
  loginpage,
  profile,
  upload,
  logout, // Import the logout function
} from "./controller.js";

export const authRouter = express.Router();

authRouter.get("/register", reigesterpage);

authRouter.post("/register", upload.single("profileImage"), register);

authRouter.get("/login", loginpage);

authRouter.post("/login", login);

authRouter.get("/profile", profile);

authRouter.get("/logout", logout); // Add the logout route


