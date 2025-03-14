/*
  Warnings:

  - You are about to drop the column `onMaintenanceBy` on the `incident` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `incident` DROP COLUMN `onMaintenanceBy`;

-- AlterTable
ALTER TABLE `maintenance` ADD COLUMN `rejectedBy` VARCHAR(191) NULL,
    ADD COLUMN `validationBy` VARCHAR(191) NULL;
