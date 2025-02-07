/*
  Warnings:

  - Made the column `createdBy` on table `incident` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `incident` MODIFY `createdBy` VARCHAR(191) NOT NULL;
