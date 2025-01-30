/*
  Warnings:

  - You are about to drop the column `closedDate` on the `offbridge` table. All the data in the column will be lost.
  - You are about to drop the column `creationDate` on the `offbridge` table. All the data in the column will be lost.
  - Added the required column `createdBy` to the `OffBridge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `OffBridge` table without a default value. This is not possible if the table is not empty.
  - Made the column `tier` on table `offbridge` required. This step will fail if there are existing NULL values in that column.
  - Made the column `loader` on table `offbridge` required. This step will fail if there are existing NULL values in that column.
  - Made the column `product` on table `offbridge` required. This step will fail if there are existing NULL values in that column.
  - Made the column `transporter` on table `offbridge` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vehicle` on table `offbridge` required. This step will fail if there are existing NULL values in that column.
  - Made the column `driver` on table `offbridge` required. This step will fail if there are existing NULL values in that column.
  - Made the column `trailer` on table `offbridge` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `offbridge` DROP COLUMN `closedDate`,
    DROP COLUMN `creationDate`,
    ADD COLUMN `createdBy` VARCHAR(191) NOT NULL,
    ADD COLUMN `creationAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updateAt` DATETIME(3) NOT NULL,
    MODIFY `tier` VARCHAR(191) NOT NULL,
    MODIFY `loader` VARCHAR(191) NOT NULL,
    MODIFY `product` VARCHAR(191) NOT NULL,
    MODIFY `transporter` VARCHAR(191) NOT NULL,
    MODIFY `vehicle` VARCHAR(191) NOT NULL,
    MODIFY `driver` VARCHAR(191) NOT NULL,
    MODIFY `trailer` VARCHAR(191) NOT NULL;
