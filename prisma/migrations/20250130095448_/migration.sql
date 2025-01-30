/*
  Warnings:

  - You are about to drop the column `blNumber` on the `incident` table. All the data in the column will be lost.
  - You are about to drop the column `container1` on the `incident` table. All the data in the column will be lost.
  - You are about to drop the column `contsiner2` on the `incident` table. All the data in the column will be lost.
  - You are about to drop the column `declarationType` on the `incident` table. All the data in the column will be lost.
  - You are about to drop the column `driver` on the `incident` table. All the data in the column will be lost.
  - You are about to drop the column `loader` on the `incident` table. All the data in the column will be lost.
  - You are about to drop the column `operation` on the `incident` table. All the data in the column will be lost.
  - You are about to drop the column `plomb1` on the `incident` table. All the data in the column will be lost.
  - You are about to drop the column `plomb2` on the `incident` table. All the data in the column will be lost.
  - You are about to drop the column `product` on the `incident` table. All the data in the column will be lost.
  - You are about to drop the column `tier` on the `incident` table. All the data in the column will be lost.
  - You are about to drop the column `trailer` on the `incident` table. All the data in the column will be lost.
  - You are about to drop the column `transporter` on the `incident` table. All the data in the column will be lost.
  - You are about to drop the column `vehicle` on the `incident` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `incident` DROP COLUMN `blNumber`,
    DROP COLUMN `container1`,
    DROP COLUMN `contsiner2`,
    DROP COLUMN `declarationType`,
    DROP COLUMN `driver`,
    DROP COLUMN `loader`,
    DROP COLUMN `operation`,
    DROP COLUMN `plomb1`,
    DROP COLUMN `plomb2`,
    DROP COLUMN `product`,
    DROP COLUMN `tier`,
    DROP COLUMN `trailer`,
    DROP COLUMN `transporter`,
    DROP COLUMN `vehicle`;

-- CreateTable
CREATE TABLE `OffBridge` (
    `id` VARCHAR(191) NOT NULL,
    `numRef` VARCHAR(191) NOT NULL,
    `incidentCauseId` VARCHAR(191) NOT NULL,
    `operation` ENUM('IMPORT', 'EXPORT', 'TRANSIT', 'OTHERS') NULL,
    `declarationType` ENUM('CONTAINER', 'BULK', 'CONVENTIONAL_WOOD_LOG', 'HEAVY_BULK', 'CONVENTIONAL_LUMBER') NULL,
    `tier` VARCHAR(191) NULL,
    `container1` VARCHAR(191) NULL,
    `contsiner2` VARCHAR(191) NULL,
    `plomb1` VARCHAR(191) NULL,
    `plomb2` VARCHAR(191) NULL,
    `loader` VARCHAR(191) NULL,
    `product` VARCHAR(191) NULL,
    `transporter` VARCHAR(191) NULL,
    `blNumber` VARCHAR(191) NULL,
    `vehicle` VARCHAR(191) NULL,
    `driver` VARCHAR(191) NULL,
    `trailer` VARCHAR(191) NULL,
    `creationDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `closedDate` DATETIME(3) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `OffBridge_numRef_key`(`numRef`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OffBridge` ADD CONSTRAINT `OffBridge_incidentCauseId_fkey` FOREIGN KEY (`incidentCauseId`) REFERENCES `IncidentCause`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
