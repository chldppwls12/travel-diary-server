/*
  Warnings:

  - Added the required column `order` to the `RecordFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `RecordFile` ADD COLUMN `order` INTEGER NOT NULL;
