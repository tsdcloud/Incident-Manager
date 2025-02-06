/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `IncidentCause` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `IncidentType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `MaintenanceType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `IncidentCause_name_key` ON `IncidentCause`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `IncidentType_name_key` ON `IncidentType`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `MaintenanceType_name_key` ON `MaintenanceType`(`name`);
