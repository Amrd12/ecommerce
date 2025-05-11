import { prisma } from "../../../index.js";

export const getProductDetail = async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!product) return res.status(404).send("Product not found");

  res.render("pages/product-detail", { product });
};

export const getHomePage = async (req, res) => {
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
  });
};

export const getProducts = async (req, res) => {
  const itemsPerPage = 10;
  const currentPage = parseInt(req.query.page) || 1;

  // Fetch all categories for the filter
  const categories = await prisma.category.findMany();

  // Get the total number of products
  const totalProducts = await prisma.product.count({
    where: {
      name: {
        contains: req.query.search || "",
      },
      categoryId: req.query.category ? parseInt(req.query.category) : undefined,
    },
  });

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const products = await prisma.product.findMany({
    take: itemsPerPage,
    skip: (currentPage - 1) * itemsPerPage,
    where: {
      name: {
        contains: req.query.search || "",
      },
      categoryId: req.query.category ? parseInt(req.query.category) : undefined,
    },
    include: {
      category: true,
    },
  });

  res.render("pages/products", {
    products,
    categories,
    user: req.session.user,
    selectedcategories: req.query.categories,
    currentPage,
    totalPages,
  });
};
