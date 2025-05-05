import express from "express";
import { PrismaClient } from "@prisma/client";
import { authRouter } from "./src/entities/auth/router.js";
import productsRouter from "./src/entities/products/products.router.js";
import cartRouter from "./src/entities/cart/cart.router.js";
import categoriesRouter from "./src/entities/categories/categories.router.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";

export const prisma = new PrismaClient();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
  })
);


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

// Use routers
app.use(authRouter);
app.use(productsRouter);
app.use(cartRouter);
app.use(categoriesRouter);

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
