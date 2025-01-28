/*
  Warnings:

  - A unique constraint covering the columns `[incidentId]` on the table `Maintenance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `incidentId` to the `Maintenance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `maintenance` ADD COLUMN `incidentId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Maintenance_incidentId_key` ON `Maintenance`(`incidentId`);

-- AddForeignKey
ALTER TABLE `Maintenance` ADD CONSTRAINT `Maintenance_incidentId_fkey` FOREIGN KEY (`incidentId`) REFERENCES `Incident`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
