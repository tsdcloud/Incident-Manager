-- DropForeignKey
ALTER TABLE `incident` DROP FOREIGN KEY `incident_incidentId_fkey`;

-- AlterTable
ALTER TABLE `incident` ADD COLUMN `closedManuDate` DATETIME(3) NULL,
    ADD COLUMN `hasStoppedOperations` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `incidentId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `incidentphoto` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NULL,
    `incidentId` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `incident` ADD CONSTRAINT `incident_incidentId_fkey` FOREIGN KEY (`incidentId`) REFERENCES `incidenttype`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `incidentphoto` ADD CONSTRAINT `incidentphoto_incidentId_fkey` FOREIGN KEY (`incidentId`) REFERENCES `incident`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
