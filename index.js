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

app.get("/", function (req, res) {
  if (req.session.user == undefined) {
    res.status(404).send({
      status: "Error",
    });
  }

  res.send({
    status: "true",
  });
  // res.render("pages/index", {
  //   tagline: "awf",
  // });
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
