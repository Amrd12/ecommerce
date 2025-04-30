// seed.js
import { PrismaClient } from "@prisma/client";
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function seed() {
    console.log('Seeding database...');

    // Create 3 categories
    const categories = [];
    for (let i = 0; i < 3; i++) {
        const category = await prisma.category.create({
            data: {
                name: faker.commerce.department() + ' ' + i,
                description: faker.lorem.sentence(),

                image: faker.image.urlLoremFlickr({ category: 'Categories' })

            },
        });
        categories.push(category);
    }

    // Create 30 products (10 per category)
    for (const category of categories) {
        for (let i = 0; i < 10; i++) {
            await prisma.product.create({
                data: {
                    name: faker.commerce.productName(),
                    price: parseFloat(faker.commerce.price()),
                    description: faker.commerce.productDescription(),
                    quantity: faker.number.int({ min: 1, max: 100 }),
                    image: faker.image.url({ width: 450, height: 450, category: 'product' }),
                    categoryId: category.id,
                },
            });

        }
    }

    console.log('Seeding completed.');
    await prisma.$disconnect();
}

seed().catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
});
