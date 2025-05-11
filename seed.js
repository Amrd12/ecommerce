import { PrismaClient } from "@prisma/client";
import fs from "fs";
import csv from "csv-parser";

const prisma = new PrismaClient();

async function main() {
  // Read categories from the database or create them if they don't exist
  const categories = [
    {
      name: "Tablet Accessories",
      description: "Cases, covers and accessories for tablets",
    },
    {
      name: "Laptop Accessories",
      description: "Cases, stands and accessories for laptops",
    },
    {
      name: "Computer Accessories & Peripherals",
      description: "General computer accessories",
    },
    {
      name: "Networking Products",
      description: "Routers, switches and networking equipment",
    },
    {
      name: "Data Storage",
      description: "Hard drives, SSDs and storage solutions",
    },
    {
      name: "Cables & Accessories",
      description: "Various cables and connectors",
    },
    {
      name: "Monitor Accessories",
      description: "Stands and accessories for monitors",
    },
  ];

  await prisma.category.createMany({
    data: categories,
    skipDuplicates: true,
  });

  // Get all categories for reference
  const allCategories = await prisma.category.findMany();
  const categoryMap = {};
  allCategories.forEach((cat) => {
    categoryMap[cat.name] = cat.id;
  });

  // Read products from the CSV file
  const products = [];
  const csvFilePath = "c:/Users/amr elnbawy/Downloads/Book1.csv";

  await new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (row) => {
        // Validate and parse the CSV data
        const price = parseFloat(row.final_price);
        if (isNaN(price)) {
          console.error(`Invalid price for product: ${row.title}`);
        }

        const product = {
          name: row.title,
          price: isNaN(price) ? 20 : price,
          description: row.description || "No description available",
          quantity: parseInt(row.availability) || 0,
          image: row.image_url || "",
          categories: row.categories
            ? row.categories.split(",").map((cat) => cat.trim())
            : [],
        };
        products.push(product);
      })
      .on("end", resolve)
      .on("error", reject);
  });

  // Insert products into the database
  for (const productData of products) {
    const categoryIds = productData.categories
      .map((catName) => categoryMap[catName])
      .filter((id) => id !== undefined) // Filter out categories that don't exist
      .map((id) => ({ id }));

    try {
      await prisma.product.create({
        data: {
          name: productData.name,
          price: productData.price,
          description: productData.description,
          quantity: productData.quantity,
          image: productData.image,
          categories: {
            connect: categoryIds,
          },
        },
      });
    } catch (error) {
      console.error(`Failed to insert product: ${productData.name}`, error);
    }
  }

  console.log("Seed data inserted successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
