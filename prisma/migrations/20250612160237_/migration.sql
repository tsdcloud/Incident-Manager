-- DropForeignKey
ALTER TABLE `maintenance` DROP FOREIGN KEY `maintenance_equipementId_fkey`;

-- DropForeignKey
ALTER TABLE `maintenance` DROP FOREIGN KEY `maintenance_incidentId_fkey`;

-- DropIndex
DROP INDEX `maintenance_equipementId_fkey` ON `maintenance`;

-- AddForeignKey
ALTER TABLE `maintenance` ADD CONSTRAINT `maintenance_incidentId_fkey` FOREIGN KEY (`incidentId`) REFERENCES `incident`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `maintenance` ADD CONSTRAINT `maintenance_equipementId_fkey` FOREIGN KEY (`equipementId`) REFERENCES `equipment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
