/*
  Warnings:

  - Added the required column `siteId` to the `OffBridge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `offbridge` ADD COLUMN `siteId` VARCHAR(191) NOT NULL;
