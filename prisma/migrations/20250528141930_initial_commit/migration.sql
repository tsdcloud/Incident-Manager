/*
  Warnings:

  - You are about to drop the `equipement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `incident` DROP FOREIGN KEY `incident_equipementId_fkey`;

-- DropForeignKey
ALTER TABLE `maintenance` DROP FOREIGN KEY `maintenance_equipementId_fkey`;

-- DropForeignKey
ALTER TABLE `movement` DROP FOREIGN KEY `movement_equipementId_fkey`;

-- DropForeignKey
ALTER TABLE `operation` DROP FOREIGN KEY `operation_equipementId_fkey`;

-- DropIndex
DROP INDEX `incident_equipementId_fkey` ON `incident`;

-- DropIndex
DROP INDEX `maintenance_equipementId_fkey` ON `maintenance`;

-- DropIndex
DROP INDEX `movement_equipementId_fkey` ON `movement`;

-- DropIndex
DROP INDEX `operation_equipementId_fkey` ON `operation`;

-- DropTable
DROP TABLE `equipement`;

-- CreateTable
CREATE TABLE `equipmentGroup` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `numRef` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `equipmentGroup_name_key`(`name`),
    UNIQUE INDEX `equipmentGroup_numRef_key`(`numRef`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipment` (
    `id` VARCHAR(191) NOT NULL,
    `numRef` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `operatingMode` DOUBLE NOT NULL,
    `siteId` VARCHAR(191) NULL,
    `startUpDate` DATETIME(3) NULL,
    `lifeSpan` DOUBLE NOT NULL,
    `scrapDate` DATETIME(3) NULL,
    `equipmentGroupId` VARCHAR(191) NOT NULL,
    `lastMaintenance` DATETIME(3) NULL,
    `periodicity` DOUBLE NOT NULL,
    `status` ENUM('NEW', 'SECOND_HAND') NOT NULL DEFAULT 'NEW',

    UNIQUE INDEX `equipment_numRef_key`(`numRef`),
    UNIQUE INDEX `equipment_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `history` (
    `id` VARCHAR(191) NOT NULL,
    `movementId` VARCHAR(191) NOT NULL,
    `operationId` VARCHAR(191) NOT NULL,
    `maintenanceId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `equipment` ADD CONSTRAINT `equipment_equipmentGroupId_fkey` FOREIGN KEY (`equipmentGroupId`) REFERENCES `equipmentGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `history` ADD CONSTRAINT `history_movementId_fkey` FOREIGN KEY (`movementId`) REFERENCES `movement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `history` ADD CONSTRAINT `history_operationId_fkey` FOREIGN KEY (`operationId`) REFERENCES `operation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `history` ADD CONSTRAINT `history_maintenanceId_fkey` FOREIGN KEY (`maintenanceId`) REFERENCES `maintenance`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movement` ADD CONSTRAINT `movement_equipementId_fkey` FOREIGN KEY (`equipementId`) REFERENCES `equipment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `operation` ADD CONSTRAINT `operation_equipementId_fkey` FOREIGN KEY (`equipementId`) REFERENCES `equipment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `incident` ADD CONSTRAINT `incident_equipementId_fkey` FOREIGN KEY (`equipementId`) REFERENCES `equipment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `maintenance` ADD CONSTRAINT `maintenance_equipementId_fkey` FOREIGN KEY (`equipementId`) REFERENCES `equipment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
