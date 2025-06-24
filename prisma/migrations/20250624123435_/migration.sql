/*
  Warnings:

  - You are about to alter the column `content` on the `operation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.

*/
-- AlterTable
ALTER TABLE `operation` MODIFY `content` DOUBLE NULL;
