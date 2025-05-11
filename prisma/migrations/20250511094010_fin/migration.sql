/*
  Warnings:

  - The primary key for the `cartproduct` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `cartproduct` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `admin` DROP FOREIGN KEY `Admin_accountId_fkey`;

-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `Cart_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `cartproduct` DROP FOREIGN KEY `CartProduct_cartId_fkey`;

-- DropForeignKey
ALTER TABLE `cartproduct` DROP FOREIGN KEY `CartProduct_productId_fkey`;

-- DropForeignKey
ALTER TABLE `customer` DROP FOREIGN KEY `Customer_accountId_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_cartId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `product_categoryId_fkey`;

-- DropIndex
DROP INDEX `product_categoryId_idx` ON `product`;

-- AlterTable
ALTER TABLE `cartproduct` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`cartId`, `productId`);

-- AlterTable
ALTER TABLE `category` DROP COLUMN `image`;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `categoryId`;

-- CreateTable
CREATE TABLE `_categoryToproduct` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_categoryToproduct_AB_unique`(`A`, `B`),
    INDEX `_categoryToproduct_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `product_id_idx` ON `product`(`id`);

-- AddForeignKey
ALTER TABLE `admin` ADD CONSTRAINT `Admin_account_relation` FOREIGN KEY (`accountId`) REFERENCES `account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart` ADD CONSTRAINT `Cart_customer_relation` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cartproduct` ADD CONSTRAINT `CartProduct_cart_relation` FOREIGN KEY (`cartId`) REFERENCES `cart`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cartproduct` ADD CONSTRAINT `CartProduct_product_relation` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customer` ADD CONSTRAINT `Customer_account_relation` FOREIGN KEY (`accountId`) REFERENCES `account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `Order_cart_relation` FOREIGN KEY (`cartId`) REFERENCES `cart`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_categoryToproduct` ADD CONSTRAINT `_categoryToproduct_A_fkey` FOREIGN KEY (`A`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_categoryToproduct` ADD CONSTRAINT `_categoryToproduct_B_fkey` FOREIGN KEY (`B`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RedefineIndex
CREATE INDEX `Cart_customer_index` ON `cart`(`customerId`);
DROP INDEX `Cart_customerId_fkey` ON `cart`;

-- RedefineIndex
CREATE INDEX `CartProduct_cart_index` ON `cartproduct`(`cartId`);
DROP INDEX `CartProduct_cartId_fkey` ON `cartproduct`;

-- RedefineIndex
CREATE INDEX `CartProduct_product_index` ON `cartproduct`(`productId`);
DROP INDEX `CartProduct_productId_fkey` ON `cartproduct`;
