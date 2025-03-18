/*
  Warnings:

  - The values [REJECT] on the enum `Maintenance_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `maintenance` MODIFY `status` ENUM('AWAITING_VALIDATION', 'PENDING', 'REJECTED', 'CLOSED') NOT NULL DEFAULT 'PENDING';
