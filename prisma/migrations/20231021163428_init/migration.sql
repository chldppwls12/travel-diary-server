/*
  Warnings:

  - Added the required column `thumbnail_link` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail_short_link` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `File` ADD COLUMN `thumbnail_link` VARCHAR(1000) NOT NULL,
    ADD COLUMN `thumbnail_short_link` VARCHAR(100) NOT NULL;
