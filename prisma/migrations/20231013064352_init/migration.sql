-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(30) NOT NULL,
    `password` VARCHAR(300) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `status` ENUM('NORMAL', 'DELETED') NOT NULL DEFAULT 'NORMAL',

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Record` (
    `id` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `weather` ENUM('SUNNY', 'PARTLY_CLOUDY', 'CLOUDY', 'STORMY', 'RAINY', 'SNOWY', 'WINDY') NOT NULL,
    `feeling` ENUM('HAPPY', 'CALM', 'SATISFIED', 'EXCITING', 'ANGRY', 'SAD') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `recordDate` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `status` ENUM('NORMAL', 'DELETED') NOT NULL DEFAULT 'NORMAL',
    `userId` VARCHAR(191) NOT NULL,
    `city_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `File` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('IMAGE', 'VOICE', 'VIDEO') NOT NULL,
    `original_name` VARCHAR(100) NOT NULL,
    `uploaded_link` VARCHAR(1000) NOT NULL,
    `short_link` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `status` ENUM('NORMAL', 'DELETED') NOT NULL DEFAULT 'NORMAL',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RecordFile` (
    `record_id` VARCHAR(191) NOT NULL,
    `file_id` VARCHAR(191) NOT NULL,
    `type` ENUM('IMAGE', 'VOICE', 'VIDEO') NOT NULL,

    PRIMARY KEY (`record_id`, `file_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Location` (
    `id` VARCHAR(191) NOT NULL,
    `do` VARCHAR(10) NOT NULL,
    `si` VARCHAR(15) NOT NULL,
    `gu` VARCHAR(15) NOT NULL,

    UNIQUE INDEX `Location_do_si_gu_key`(`do`, `si`, `gu`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `City` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(10) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Record` ADD CONSTRAINT `Record_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Record` ADD CONSTRAINT `Record_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecordFile` ADD CONSTRAINT `RecordFile_record_id_fkey` FOREIGN KEY (`record_id`) REFERENCES `Record`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecordFile` ADD CONSTRAINT `RecordFile_file_id_fkey` FOREIGN KEY (`file_id`) REFERENCES `File`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
