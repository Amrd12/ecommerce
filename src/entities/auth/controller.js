import { prisma } from "../../../index.js";
import express from "express";
import { UserTypeEnum } from "../../core/enums/role_enum.js";
import bcrypt from "bcrypt";
import multer from "multer";

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

  const user = await prisma.account.findUnique({
    where: { email },
    include: { customer: true },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.render('pages/auth/login', { error: 'Invalid email or password' });
  }

  // Save user session
  req.session.user = user.customer;

  // Redirect to the intended page or default to profile
  const redirectTo = req.session.redirectTo || '/';
  delete req.session.redirectTo; // Clear the redirectTo session variable
  res.redirect(redirectTo);
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

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.redirect("/profile"); // Redirect to profile if logout fails
    }
    res.redirect("/login"); // Redirect to login after successful logout
  });
};
