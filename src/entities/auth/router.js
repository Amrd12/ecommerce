import express from "express";
import {
  reigesterpage,
  register,
  login,
  loginpage,
  profile,
  upload,
} from "./controller.js";

export const authRouter = express.Router();

authRouter.get("/register", reigesterpage);

authRouter.post("/register", upload.single("profileImage"), register);

authRouter.get("/login", loginpage);

authRouter.post("/login", login);

authRouter.get("/profile", profile);
