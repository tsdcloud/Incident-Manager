/*
  Warnings:

  - You are about to drop the column `operations` on the `incident` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `incident` DROP COLUMN `operations`,
    ADD COLUMN `operation` ENUM('IMPORT', 'EXPORT', 'TRANSIT', 'OTHERS') NULL;
