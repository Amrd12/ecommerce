import { prisma } from "../../../index.js";

export const addToCart = (req, res) => {
  const { id, name, price } = req.body;
  if (!req.session.cart) req.session.cart = [];
  req.session.cart.push({ id, name, price });
  res.sendStatus(200);
};

export const getCart = (req, res) => {
  const cart = req.session.cart || [];
  if (req.session.user == undefined) {
    res.redirect("login");
  }
  res.render("pages/checkout", { user: req.session.user, cart });
};

export const clearCart = (req, res) => {
  req.session.cart = [];
  res.redirect("/checkout");
};


export const makeOrder = async (req, res) => {
  const { cart } = req.session.cart;
  const userId = req.session.user.id;

  const order = await prisma.order.create({
    data: {
      cartId: activeCart.id,
      address: req.body.address,
      payment: req.body.paymentMethod,
    },
  });
  res.status(201).json(order);
}