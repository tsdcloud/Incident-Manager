-- AlterTable
ALTER TABLE `incident` MODIFY `userId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `offbridge` ADD COLUMN `updatedBy` VARCHAR(191) NULL;
