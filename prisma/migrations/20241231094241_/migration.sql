/*
  Warnings:

  - You are about to drop the `incidentcauses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `incident` DROP FOREIGN KEY `Incident_incidentCauseId_fkey`;

-- DropIndex
DROP INDEX `Incident_incidentCauseId_fkey` ON `incident`;

-- DropTable
DROP TABLE `incidentcauses`;

-- CreateTable
CREATE TABLE `IncidentCause` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Incident` ADD CONSTRAINT `Incident_incidentCauseId_fkey` FOREIGN KEY (`incidentCauseId`) REFERENCES `IncidentCause`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
