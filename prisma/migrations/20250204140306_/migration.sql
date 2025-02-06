-- AlterTable
ALTER TABLE `incident` ADD COLUMN `closedBy` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `maintenance` ADD COLUMN `closedBy` VARCHAR(191) NULL;
