-- CreateTable
CREATE TABLE `movement` (
    `id` VARCHAR(191) NOT NULL,
    `equipementId` VARCHAR(191) NOT NULL,
    `fromSite` VARCHAR(191) NOT NULL,
    `toSite` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `actionType` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `operation` (
    `id` VARCHAR(191) NOT NULL,
    `siteId` VARCHAR(191) NOT NULL,
    `actionTypeId` VARCHAR(191) NOT NULL,
    `equipementId` VARCHAR(191) NOT NULL,
    `contenu` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `movement` ADD CONSTRAINT `movement_equipementId_fkey` FOREIGN KEY (`equipementId`) REFERENCES `equipement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `operation` ADD CONSTRAINT `operation_actionTypeId_fkey` FOREIGN KEY (`actionTypeId`) REFERENCES `actionType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `operation` ADD CONSTRAINT `operation_equipementId_fkey` FOREIGN KEY (`equipementId`) REFERENCES `equipement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
