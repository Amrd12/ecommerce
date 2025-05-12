// Prisma seed script to populate the database using a CSV file
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

const prisma = new PrismaClient();

async function main() {
  const filePath = ".amazon-products";
  const products = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        if (row['title'] && row['final_price'] && row['categories']) {
          let categories = [];
          try {
            categories = JSON.parse(row['categories']);
          } catch (error) {
            console.error(`Error parsing categories for row: ${row['title']}`, error);
          }

          products.push({
            name: row['title'],
            price: parseFloat(row['final_price']) || 200,
            description: row['description'] || '',
            quantity: parseInt(row['number_of_sellers']) || 0,
            image: row['image_url'] || '',
            categoryName : categories[0], // Store the parsed categories array
          });
        }
      })
      .on('end', resolve)
      .on('error', reject);
  });

  for (const product of products) {
    if (!product.categoryName) continue;

    const category = await prisma.category.upsert({
      where: { name: product.categoryName },
      update: {},
      create: {
        name: product.categoryName,
        description: ''
      }
    });

    await prisma.product.create({
      data: {
        name: product.name,
        price: product.price,
        description: product.description,
        quantity: product.quantity,
        image: product.image,
        categoryId: category.id
      }
    });
  }

  console.log('Seeding completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });