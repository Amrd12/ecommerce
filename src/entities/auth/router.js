import express from "express";
import {
  reigesterpage,
  register,
  login,
  loginpage,
  profile,
} from "./controller.js";

export const authRouter = express.Router();

authRouter.get("/register", reigesterpage);

authRouter.post("/register", register);

authRouter.get("/login", loginpage);

authRouter.post("/login", login);

authRouter.get("/profile", profile);
