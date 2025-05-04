import express from "express";
import {
  reigesterpage,
  register,
  login,
  loginpage,
  profile,
  upload,
  logout, // Import the logout function
} from "./controller.js";

export const authRouter = express.Router();

authRouter.get("/register", reigesterpage);

authRouter.post("/register", upload.single("profileImage"), register);

authRouter.get("/login", loginpage);

authRouter.post("/login", login);

authRouter.get("/profile", profile);

authRouter.get("/logout", logout); // Add the logout route

authRouter.get("/category1", async (req, res) => {
  try {
    // Fetch products for category one from the database
    const categoryOneProducts = await prisma.product.findMany({
      where: { categoryId: 1 }, // Replace `1` with the actual ID of category one
    });

    // Render the category1 page and pass the products
    res.render("pages/category1", { products: categoryOneProducts });
  } catch (error) {
    console.error("Error fetching category one products:", error);
    res.status(500).send("Internal Server Error");
  }
});

