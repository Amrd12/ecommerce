import { prisma } from "../../../index.js";

export const addToCart = (req, res) => {
  const { id, name, price } = req.body;
  if (!req.session.cart) req.session.cart = [];
  req.session.cart.push({ id, name, price });
  res.sendStatus(200);
};

export const getCart = (req, res) => {
  const cart = req.session.cart || [];
  res.render("pages/checkout", { user: req.session.user, cart });
};

export const clearCart = (req, res) => {
  req.session.cart = [];
  res.redirect("/checkout");
};
