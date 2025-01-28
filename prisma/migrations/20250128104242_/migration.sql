/*
  Warnings:

  - You are about to drop the column `periodicity` on the `maintenance` table. All the data in the column will be lost.
  - Added the required column `projectedDate` to the `Maintenance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `maintenance` DROP COLUMN `periodicity`,
    ADD COLUMN `nextMaintenance` DATETIME(3) NULL,
    ADD COLUMN `projectedDate` DATETIME(3) NOT NULL;
