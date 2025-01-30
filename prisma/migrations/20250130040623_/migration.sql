/*
  Warnings:

  - You are about to drop the column `weighbridge` on the `incident` table. All the data in the column will be lost.
  - You are about to alter the column `operations` on the `incident` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `incident` DROP COLUMN `weighbridge`,
    MODIFY `operations` ENUM('IMPORT', 'EXPORT', 'TRANSIT', 'OTHERS') NULL;
