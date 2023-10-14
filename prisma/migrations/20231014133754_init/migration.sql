/*
  Warnings:

  - Added the required column `provinceId` to the `Record` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Record` ADD COLUMN `provinceId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Record` ADD CONSTRAINT `Record_provinceId_fkey` FOREIGN KEY (`provinceId`) REFERENCES `Province`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
