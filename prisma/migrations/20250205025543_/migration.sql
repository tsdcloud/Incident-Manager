/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Equipement` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Equipement_name_key` ON `Equipement`(`name`);
