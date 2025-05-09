/*
  Warnings:

  - The values [AWAITING_VALIDATION] on the enum `maintenance_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `maintenance` MODIFY `status` ENUM('PENDING', 'CLOSED') NOT NULL DEFAULT 'PENDING';
