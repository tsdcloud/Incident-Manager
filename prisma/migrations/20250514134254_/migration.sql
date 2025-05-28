/*
  Warnings:

  - You are about to drop the column `actionTypeId` on the `operation` table. All the data in the column will be lost.
  - You are about to drop the column `contenu` on the `operation` table. All the data in the column will be lost.
  - You are about to drop the `actiontype` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `actionType` to the `operation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `operation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `operation` DROP FOREIGN KEY `operation_actionTypeId_fkey`;

-- DropIndex
DROP INDEX `operation_actionTypeId_fkey` ON `operation`;

-- AlterTable
ALTER TABLE `operation` DROP COLUMN `actionTypeId`,
    DROP COLUMN `contenu`,
    ADD COLUMN `actionType` ENUM('START', 'STOP', 'REFUEL') NOT NULL,
    ADD COLUMN `content` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `actiontype`;
