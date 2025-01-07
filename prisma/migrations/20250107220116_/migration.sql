/*
  Warnings:

  - The values [UNDER_MAINTENANCE] on the enum `Maintenance_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `maintenance` MODIFY `status` ENUM('PENDING', 'CLOSED') NOT NULL DEFAULT 'PENDING';
