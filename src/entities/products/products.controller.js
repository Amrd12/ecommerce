import { prisma } from "../../../index.js";

export const getProductDetail = async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!product) return res.status(404).send("Product not found");

  res.render("pages/product-detail", { product });
};

export const getHomePage = async (req, res) => {
  try {
    // Fetch the latest 10 products
    const products = await prisma.product.findMany({
      take: 10,
      include: {
        categories: true, // Include related categories
      },
    });

    // Fetch the latest 10 categories
    const categories = await prisma.category.findMany({
      take: 10,
      include: {
        products: true, // Include related products
      },
    });

    res.render("pages/index", {
      products, // Pass products to the view
      categories, // Pass categories to the view
      user: req.session.user, // Pass the logged-in user (if any)
    });
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const getProducts = async (req, res) => {
  try {
    const itemsPerPage = 10; // Number of products per page
    const currentPage = parseInt(req.query.page) || 1; // Current page from query params
    const searchQuery = req.query.search || ""; // Search query
    const selectedCategory = req.query.category
      ? parseInt(req.query.category)
      : []; // Selected category

    // Fetch all categories for the filter
    const categories = await prisma.category.findMany();

    // Get the total number of products matching the filters
    const totalProducts = await prisma.product.count({
      where: {
        name: {
          contains: searchQuery, // Filter by search query
        },
        categories: selectedCategory
          ? {
              some: {
                id: selectedCategory, // Filter by selected category
              },
            }
          : undefined,
      },
    });

    const totalPages = Math.ceil(totalProducts / itemsPerPage); // Calculate total pages

    // Fetch products for the current page
    const products = await prisma.product.findMany({
      take: itemsPerPage,
      skip: (currentPage - 1) * itemsPerPage,
      where: {
        name: {
          contains: searchQuery, // Filter by search query
        },
        categories: selectedCategory
          ? {
              some: {
                id: selectedCategory, // Filter by selected category
              },
            }
          : undefined,
      },
      include: {
        categories: true, // Include related categories
      },
    });

    res.render("pages/products", {
      products, // Pass products to the view
      categories, // Pass categories to the view
      user: req.session.user, // Pass the logged-in user (if any)
      selectedCategory, // Pass the selected category
      currentPage, // Pass the current page
      totalPages, // Pass the total number of pages
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal Server Error");
  }
};
