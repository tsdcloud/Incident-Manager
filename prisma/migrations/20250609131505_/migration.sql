/*
  Warnings:

  - You are about to drop the column `type` on the `maintenancetype` table. All the data in the column will be lost.
  - Added the required column `maintenance` to the `maintenance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `maintenance` DROP FOREIGN KEY `maintenance_maintenanceId_fkey`;

-- DropIndex
DROP INDEX `maintenance_maintenanceId_fkey` ON `maintenance`;

-- AlterTable
ALTER TABLE `maintenance` ADD COLUMN `maintenance` ENUM('CORRECTION', 'PALLIATIVE', 'CURATIVE', 'PROGRAMMED') NOT NULL;

-- AlterTable
ALTER TABLE `maintenancetype` DROP COLUMN `type`;
