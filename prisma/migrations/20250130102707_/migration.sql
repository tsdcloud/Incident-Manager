/*
  Warnings:

  - You are about to drop the column `creationAt` on the `offbridge` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `offbridge` DROP COLUMN `creationAt`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
