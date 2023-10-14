/*
  Warnings:

  - You are about to drop the column `provinceId` on the `City` table. All the data in the column will be lost.
  - You are about to drop the column `provinceId` on the `Record` table. All the data in the column will be lost.
  - Added the required column `province_id` to the `City` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province_id` to the `Record` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `City` DROP FOREIGN KEY `City_provinceId_fkey`;

-- DropForeignKey
ALTER TABLE `Record` DROP FOREIGN KEY `Record_provinceId_fkey`;

-- AlterTable
ALTER TABLE `City` DROP COLUMN `provinceId`,
    ADD COLUMN `province_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Record` DROP COLUMN `provinceId`,
    ADD COLUMN `province_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Record` ADD CONSTRAINT `Record_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `Province`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `City` ADD CONSTRAINT `City_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `Province`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
