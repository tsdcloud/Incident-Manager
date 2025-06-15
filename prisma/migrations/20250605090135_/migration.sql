-- AlterTable
ALTER TABLE `equipment` MODIFY `operatingMode` DOUBLE NOT NULL DEFAULT 0.0,
    MODIFY `lifeSpan` DOUBLE NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `equipmentgroup` ADD COLUMN `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `incidentcause` ADD COLUMN `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `incidenttype` ADD COLUMN `description` VARCHAR(191) NULL;
