/*
  Warnings:

  - You are about to drop the column `profileImage` on the `account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `account` DROP COLUMN `profileImage`;

-- AlterTable
ALTER TABLE `customer` ADD COLUMN `profileImage` VARCHAR(191) NULL;
