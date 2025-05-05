import { prisma } from "../../../index.js";

export const getCategoryPage = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id, 10);
    if (isNaN(categoryId)) {
      return res.status(400).send("Invalid category ID");
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { products: true },
    });

    if (!category) {
      return res.status(404).send("Category not found");
    }

    res.render("pages/category", {
      user: req.session.user,
      categoryName: category.name,
      products: category.products,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).send("Internal Server Error");
  }
};
