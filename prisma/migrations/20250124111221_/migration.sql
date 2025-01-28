/*
  Warnings:

  - You are about to drop the `supplier` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `maintenance` DROP FOREIGN KEY `Maintenance_supplierId_fkey`;

-- DropIndex
DROP INDEX `Maintenance_supplierId_fkey` ON `maintenance`;

-- DropTable
DROP TABLE `supplier`;
