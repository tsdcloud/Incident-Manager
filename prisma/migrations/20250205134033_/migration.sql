-- DropForeignKey
ALTER TABLE `incident` DROP FOREIGN KEY `Incident_incidentCauseId_fkey`;

-- DropIndex
DROP INDEX `Incident_incidentCauseId_fkey` ON `incident`;

-- AlterTable
ALTER TABLE `incident` MODIFY `incidentCauseId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Incident` ADD CONSTRAINT `Incident_incidentCauseId_fkey` FOREIGN KEY (`incidentCauseId`) REFERENCES `IncidentCause`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
