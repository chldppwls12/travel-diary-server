/*
  Warnings:

  - You are about to drop the column `groupId` on the `City` table. All the data in the column will be lost.
  - The primary key for the `ProvinceGroup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `groupId` on the `ProvinceGroup` table. All the data in the column will be lost.
  - You are about to drop the column `provinceId` on the `ProvinceGroup` table. All the data in the column will be lost.
  - Added the required column `group_id` to the `City` table without a default value. This is not possible if the table is not empty.
  - Added the required column `group_id` to the `ProvinceGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province_id` to the `ProvinceGroup` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `City` DROP FOREIGN KEY `City_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `ProvinceGroup` DROP FOREIGN KEY `ProvinceGroup_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `ProvinceGroup` DROP FOREIGN KEY `ProvinceGroup_provinceId_fkey`;

-- AlterTable
ALTER TABLE `City` DROP COLUMN `groupId`,
    ADD COLUMN `group_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `ProvinceGroup` DROP PRIMARY KEY,
    DROP COLUMN `groupId`,
    DROP COLUMN `provinceId`,
    ADD COLUMN `group_id` INTEGER NOT NULL,
    ADD COLUMN `province_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`province_id`, `group_id`);

-- CreateTable
CREATE TABLE `RecordGroup` (
    `record_id` VARCHAR(191) NOT NULL,
    `group_id` INTEGER NOT NULL,

    PRIMARY KEY (`record_id`, `group_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RecordGroup` ADD CONSTRAINT `RecordGroup_record_id_fkey` FOREIGN KEY (`record_id`) REFERENCES `Record`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecordGroup` ADD CONSTRAINT `RecordGroup_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `Group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProvinceGroup` ADD CONSTRAINT `ProvinceGroup_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `Province`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProvinceGroup` ADD CONSTRAINT `ProvinceGroup_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `Group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `City` ADD CONSTRAINT `City_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `Group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
