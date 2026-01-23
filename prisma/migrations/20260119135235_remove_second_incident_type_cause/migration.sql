/*
  Warnings:

  - You are about to drop the `_incidentcausetoincidenttype` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_incidentcausetoincidenttype` DROP FOREIGN KEY `_incidentcausetoincidenttype_A_fkey`;

-- DropForeignKey
ALTER TABLE `_incidentcausetoincidenttype` DROP FOREIGN KEY `_incidentcausetoincidenttype_B_fkey`;

-- DropTable
DROP TABLE `_incidentcausetoincidenttype`;
