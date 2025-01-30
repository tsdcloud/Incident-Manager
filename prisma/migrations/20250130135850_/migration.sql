/*
  Warnings:

  - You are about to drop the column `contsiner2` on the `offbridge` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `offbridge` DROP COLUMN `contsiner2`,
    ADD COLUMN `container2` VARCHAR(191) NULL;
