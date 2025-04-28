import { prisma } from "../../../index.js";
import express from "express";
import { UserTypeEnum } from "../../core/enums/role_enum.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const reigesterpage = async (req, res) => {
  res.render("pages/auth/register");
};

export const register = async (req, res) => {
  const { email, password, name, phoneNumber } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const found = await prisma.account.findUnique({
    where: {
      email: email,
    },
  });
  if (found != null) {
    res.render("pages/auth/register", { error: "email found" });
  }
  const data = await prisma.account
    .create({
      data: {
        email: email,
        password: hashedPassword,
        role: UserTypeEnum.user,
        customer: {
          create: {
            name: name,
            phoneNumber: phoneNumber,
          },
        },
      },
    })
    .customer();
  req.session.user = {
    data: data,
  };
  res.redirect("/profile");
};

export const loginpage = async (req, res) => {
  res.render("pages/auth/login");
};

export const login = async (req, res) => {
  const { email, password } = req.body;

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
  res.render("pages/auth/user", req.session.user);
};
