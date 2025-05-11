import express from "express";
import { authRouter } from "./src/entities/auth/router.js";
import productsRouter from "./src/entities/products/products.router.js";
import cartRouter from "./src/entities/cart/cart.router.js";
import categoriesRouter from "./src/entities/categories/categories.router.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import serverless from "serverless-http"; // 🟡 this is crucial for serverless deployment
import path from "path";
import { fileURLToPath } from "url";
import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import { Database, Resource, getModelByName } from "@adminjs/prisma";
import { PrismaClient } from "@prisma/client";
import {
  ensureAdmin,
  ensureAuthenticated,
} from "./src/core/middleware/authMiddleware.js";

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
checkPrismaConnection();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.get("/hi", (req, res) => res.json({ hi: "hi" }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: false, // disable draft headers
    legacyHeaders: true, // enable legacy headers
    validate: { ip: false },
  })
);

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

// Register the Prisma adapter for AdminJS
// AdminJS.registerAdapter(AdminJSPrisma);
AdminJS.registerAdapter({ Database, Resource });

const adminOptions = {
  resources: [
    {
      resource: { model: getModelByName("product"), client: prisma },
      options: {
        properties: {
          image: {
            isVisible: { list: true, edit: true, show: true },
            isTitle: true, // Use this field as the title in the list view
          },
          categories: {
            type: "reference",
            isArray: true, // Indicates a many-to-many relationship
            isVisible: { list: true, edit: true, show: true },
          },
        },
      },
    },
    {
      resource: { model: getModelByName("category"), client: prisma },
      options: {},
    },
    {
      resource: { model: getModelByName("account"), client: prisma },
      options: {
        properties: {
          password: { isVisible: { list: false, edit: true, show: false } }, // Hide password in list and show views
        },
      },
    },
    {
      resource: { model: getModelByName("admin"), client: prisma },
      options: {},
    },
    {
      resource: { model: getModelByName("cart"), client: prisma },
      options: {},
    },
    {
      resource: { model: getModelByName("customer"), client: prisma },
      options: {},
    },
    {
      resource: { model: getModelByName("order"), client: prisma },
      options: {},
    },
  ],
};

const admin = new AdminJS({
  rootPath: "/admin",
  resources: adminOptions.resources,
});

const adminRouter = AdminJSExpress.buildRouter(admin);

// Use the AdminJS router
app.use(admin.options.rootPath, ensureAuthenticated, ensureAdmin, adminRouter);

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
// export default serverless(app);
