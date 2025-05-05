import express from "express";
import { PrismaClient } from "@prisma/client";
import { authRouter } from "./src/entities/auth/router.js";
import productsRouter from "./src/entities/products/products.router.js";
import cartRouter from "./src/entities/cart/cart.router.js";
import categoriesRouter from "./src/entities/categories/categories.router.js";
import session from "express-session";
import cookieParser from "cookie-parser";
// import { rateLimit } from "express-rate-limit";
// import connectPgSimple from "connect-pg-simple";
// import { Pool } from "pg";
import serverless from "serverless-http"; // 🟡 this is crucial for serverless deployment
import path from "path";
import { fileURLToPath } from "url";

export const prisma = new PrismaClient();
const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.set("views", path.join(__dirname, "views"));
app.set("trust proxy", 1);
 async function checkPrismaConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Prisma connected successfully.");
  } catch (error) {
    console.error("❌ Prisma connection failed:", error);
    process.exit(1); // Optional: exit the app if DB is critical
  } finally {
    await prisma.$disconnect();
  }
}
checkPrismaConnection()
// const pgSession = connectPgSimple(session);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000,
//     limit: 100,
//     standardHeaders: false, // disable draft headers
//     legacyHeaders: true, // enable legacy headers
//     validate: { ip: false },
//   })
// );

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// app.use(
//   session({
//     store: new pgSession({
//       pool: pool,
//       tableName: "user_sessions", // optional, default is "session"
//     }),
//     secret: process.env.SESSION_SECRET || "fallback_secret",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 10 * 60 * 60 * 1000, // 10 hours
//       httpOnly: true,
//     },
//   })
// );
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 10 * 60 * 60 * 1000,
      httpOnly: true,
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
export default serverless(app);
