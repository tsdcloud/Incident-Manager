/*
  Warnings:

  - You are about to drop the column `fromSite` on the `movement` table. All the data in the column will be lost.
  - You are about to drop the column `toSite` on the `movement` table. All the data in the column will be lost.
  - Added the required column `destinationSite` to the `movement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originSite` to the `movement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `movement` DROP COLUMN `fromSite`,
    DROP COLUMN `toSite`,
    ADD COLUMN `destinationSite` VARCHAR(191) NOT NULL,
    ADD COLUMN `originSite` VARCHAR(191) NOT NULL;
