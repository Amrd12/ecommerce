/*
  Warnings:

  - The primary key for the `cartproduct` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `_categorytoproduct` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id` to the `cartproduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_categorytoproduct` DROP FOREIGN KEY `_categoryToproduct_A_fkey`;

-- DropForeignKey
ALTER TABLE `_categorytoproduct` DROP FOREIGN KEY `_categoryToproduct_B_fkey`;

-- DropIndex
DROP INDEX `product_id_idx` ON `product`;

-- AlterTable
ALTER TABLE `cartproduct` DROP PRIMARY KEY,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `category` ADD COLUMN `image` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `categoryId` INTEGER NULL;

-- DropTable
DROP TABLE `_categorytoproduct`;

-- CreateIndex
CREATE INDEX `Product_category_index` ON `product`(`categoryId`);

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
