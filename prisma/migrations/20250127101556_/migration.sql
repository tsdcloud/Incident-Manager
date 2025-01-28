/*
  Warnings:

  - Added the required column `equipementId` to the `Maintenance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `maintenance` ADD COLUMN `equipementId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Maintenance` ADD CONSTRAINT `Maintenance_equipementId_fkey` FOREIGN KEY (`equipementId`) REFERENCES `Equipement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
