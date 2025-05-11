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
    return;
  }
  res.render("pages/checkout", { user: req.session.user, cart });
};

export const clearCart = (req, res) => {
  req.session.cart = [];
  res.redirect("/checkout" );
};

export const makeOrder = async (req, res) => {
  try {
    const { cart } = req.session;
    const userId = req.session.user.id;
    const { address, paymentMethod } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Step 1: Create a cart in the database
    const activeCart = await prisma.cart.create({
      data: {
        name: `Cart for user ${userId}`,
        customerId: userId,
        status: "started",
      },
    });

    // Step 2: Add products to the cart
    const cartProducts = cart.map((item) => ({
      cartId: activeCart.id,
      productId: item.id,
    }));

    await prisma.cartproduct.createMany({
      data: cartProducts,
    });

    // Step 3: Create an order linked to the cart
    const order = await prisma.order.create({
      data: {
        cartId: activeCart.id,
        address,
        payment: paymentMethod,
      },
    });

    // Clear the session cart after order creation
    req.session.cart = [];

    res.redirect("/profile"); // Redirect to profile after successful order
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
