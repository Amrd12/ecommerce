import express from "express";
import { PrismaClient } from "@prisma/client";
import { authRouter } from "./src/entities/auth/router.js";
import session from "express-session";
import cookieParser from "cookie-parser";
export const prisma = new PrismaClient();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

app.use(
  session({
    secret: "your_secret_key", // 🔥 move this to .env later
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true if using HTTPS
      maxAge: 10 * 60 * 60 * 1000, // 10 hours in milliseconds
      httpOnly: true, // JS cannot access cookie (safe!)
    },
  })
);
app.set("view engine", "ejs");
app.use(authRouter);
async function main() {
  try {
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Connected to MySQL via Prisma:", result);
  } catch (error) {
    console.error("❌ Connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}


main();


app.get("/checkout", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  const user = req.session.user;
  const cart = req.session.cart || [];
  res.render("pages/checkout", { user, cart });
});
app.get("/product/:id", async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(req.params.id) }
  });

  if (!product) return res.status(404).send("Product not found");

  res.render("pages/product-detail", { product });
});
app.post("/cart/add", (req, res) => {
  const { id, name, price } = req.body;
  if (!req.session.cart) req.session.cart = [];
  req.session.cart.push({ id, name, price });
  res.sendStatus(200);
});
app.use((req, res, next) => {
  if (!req.session.cart) req.session.cart = [];
  res.locals.cart = req.session.cart;
  next();
});




app.get("/", async function (req, res) {


  const data = await prisma.product.findMany({ take: 10 });
  const categories = await prisma.category.findMany({
    take: 10,
    include: {
      products: true,
    },
  });


  res.render("pages/index", {
    product: data,
    categories: categories,
    user: req.session.user,
  }

  );
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});

prisma.account.create({
  data: {
    customer: {
      create: {
        name: "",
        phoneNumber: "",
      },
    },
    email: "",
    password: "",
    role: "",
  },
});

