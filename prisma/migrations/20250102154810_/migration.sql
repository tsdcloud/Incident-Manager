-- AlterTable
ALTER TABLE `consommable` MODIFY `updatedBy` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `equipement` MODIFY `updatedBy` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `incident` MODIFY `updatedBy` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `incidentcause` MODIFY `updatedBy` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `incidenttype` MODIFY `updatedBy` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `maintenance` MODIFY `updatedBy` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `maintenancetype` MODIFY `updatedBy` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `supplier` MODIFY `updatedBy` VARCHAR(191) NULL;
