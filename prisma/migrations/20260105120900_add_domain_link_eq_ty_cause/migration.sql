-- AlterTable
ALTER TABLE `equipmentgroupfamily` ADD COLUMN `domain` ENUM('IT', 'HSE', 'OPERATIONS', 'MAINTENANCE') NULL;

-- AlterTable
ALTER TABLE `incidentcause` ADD COLUMN `incidentTypeId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `incidenttype` ADD COLUMN `domain` ENUM('IT', 'HSE', 'OPERATIONS', 'MAINTENANCE') NULL;

-- AddForeignKey
ALTER TABLE `incidentcause` ADD CONSTRAINT `incidentcause_incidentTypeId_fkey` FOREIGN KEY (`incidentTypeId`) REFERENCES `incidenttype`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
