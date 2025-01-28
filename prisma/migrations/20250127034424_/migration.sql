/*
  Warnings:

  - A unique constraint covering the columns `[numRef]` on the table `Consommable` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[numRef]` on the table `Equipement` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[numRef]` on the table `Incident` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[numRef]` on the table `IncidentCause` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[numRef]` on the table `IncidentType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[numRef]` on the table `Maintenance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[numRef]` on the table `MaintenanceType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `numRef` to the `Consommable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numRef` to the `Equipement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numRef` to the `Incident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numRef` to the `IncidentCause` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numRef` to the `IncidentType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numRef` to the `Maintenance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numRef` to the `MaintenanceType` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `incident` DROP FOREIGN KEY `Incident_consomableId_fkey`;

-- DropForeignKey
ALTER TABLE `maintenance` DROP FOREIGN KEY `Maintenance_incidentId_fkey`;

-- DropIndex
DROP INDEX `Incident_consomableId_fkey` ON `incident`;

-- AlterTable
ALTER TABLE `consommable` ADD COLUMN `numRef` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `equipement` ADD COLUMN `numRef` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `incident` ADD COLUMN `numRef` VARCHAR(191) NOT NULL,
    MODIFY `consomableId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `incidentcause` ADD COLUMN `numRef` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `incidenttype` ADD COLUMN `numRef` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `maintenance` ADD COLUMN `numRef` VARCHAR(191) NOT NULL,
    ADD COLUMN `periodicity` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    MODIFY `incidentId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `maintenancetype` ADD COLUMN `numRef` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Consommable_numRef_key` ON `Consommable`(`numRef`);

-- CreateIndex
CREATE UNIQUE INDEX `Equipement_numRef_key` ON `Equipement`(`numRef`);

-- CreateIndex
CREATE UNIQUE INDEX `Incident_numRef_key` ON `Incident`(`numRef`);

-- CreateIndex
CREATE UNIQUE INDEX `IncidentCause_numRef_key` ON `IncidentCause`(`numRef`);

-- CreateIndex
CREATE UNIQUE INDEX `IncidentType_numRef_key` ON `IncidentType`(`numRef`);

-- CreateIndex
CREATE UNIQUE INDEX `Maintenance_numRef_key` ON `Maintenance`(`numRef`);

-- CreateIndex
CREATE UNIQUE INDEX `MaintenanceType_numRef_key` ON `MaintenanceType`(`numRef`);

-- AddForeignKey
ALTER TABLE `Incident` ADD CONSTRAINT `Incident_consomableId_fkey` FOREIGN KEY (`consomableId`) REFERENCES `Consommable`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Maintenance` ADD CONSTRAINT `Maintenance_incidentId_fkey` FOREIGN KEY (`incidentId`) REFERENCES `Incident`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
