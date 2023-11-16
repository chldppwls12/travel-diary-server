/*
  Warnings:

  - Added the required column `user_id` to the `RecordGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `RecordGroup` ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `RecordGroup` ADD CONSTRAINT `RecordGroup_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
