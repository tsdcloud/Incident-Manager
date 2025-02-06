-- DropForeignKey
ALTER TABLE `incident` DROP FOREIGN KEY `Incident_equipementId_fkey`;

-- DropIndex
DROP INDEX `Incident_equipementId_fkey` ON `incident`;

-- AlterTable
ALTER TABLE `incident` MODIFY `equipementId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Incident` ADD CONSTRAINT `Incident_equipementId_fkey` FOREIGN KEY (`equipementId`) REFERENCES `Equipement`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
