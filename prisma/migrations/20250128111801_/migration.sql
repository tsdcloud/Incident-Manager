/*
  Warnings:

  - Added the required column `siteId` to the `Equipement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `equipement` ADD COLUMN `siteId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `maintenance` MODIFY `projectedDate` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `maintenancetype` ADD COLUMN `hasIncident` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `hasProjectionDate` BOOLEAN NOT NULL DEFAULT true;
