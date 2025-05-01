import { prisma } from "../../../index.js";
import express from "express";
import { UserTypeEnum } from "../../core/enums/role_enum.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads"); // Save files to the "public/uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });

export const reigesterpage = async (req, res) => {
  res.render("pages/auth/register");
};

export const register = async (req, res) => {
  if (req.session.user != undefined) {
    res.redirect("/profile");
    return;
  }

  const { email, password, name, phoneNumber } = req.body;
  const profileImage = req.file ? `/uploads/${req.file.filename}` : "/images/default-avatar.png"; // Use default if no image is uploaded

  const hashedPassword = await bcrypt.hash(password, 10);

  const found = await prisma.account.findUnique({
    where: { email },
  });

  if (found != null) {
    res.render("pages/auth/register", { error: "Email already exists" });
    return;
  }

  const data = await prisma.account.create({
    data: {
      email,
      password: hashedPassword,
      role: UserTypeEnum.user,
      customer: {
        create: {
          name,
          phoneNumber,
          profileImage, // Save the image path
        },
      },
    },
  });

  req.session.user = {
    data: data.customer,
  };

  res.redirect("/profile");
};

export const loginpage = async (req, res) => {
  if (req.session.user != undefined) {
    res.redirect("/profile");
    return;
  }
  res.render("pages/auth/login");
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (req.session.user != undefined) {
    res.redirect("/profile");
    return;
  }
  const account = await prisma.account.findUnique({
    where: { email },
    include: { customer: true },
  });

  if (!account) {
    return res
      .status(401)
      .render("pages/auth/login", { error: "Invalid email or password." });
  }

  const isPasswordValid = await bcrypt.compare(password, account.password);
  if (!isPasswordValid) {
    return res
      .status(401)
      .render("pages/auth/login", { error: "Invalid email or password." });
  }

  // Create a session for this user
  req.session.user = {
    data: await prisma.customer.findUnique({
      where: {
        accountId: account.id,
      },
    }),
  };

  // After login, redirect or render page
  res.redirect("/profile");
};

export const profile = async (req, res) => {
  if (req.session.user == undefined) {
    res.redirect("login");
    return;
  }
  res.render("pages/auth/user", {
    user: req.session.user,
  });
};
