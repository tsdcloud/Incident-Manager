/*
  Warnings:

  - A unique constraint covering the columns `[hseId,reportingCgId]` on the table `hsereporting` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hseId,watchReportId]` on the table `hsereporting` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[operatorId,reportingCgId]` on the table `operatorreporting` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[operatorId,watchReportId]` on the table `operatorreporting` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[consumableId,reportingCgId]` on the table `outofstockconsumablereportingcg` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[consumableId,watchReportId]` on the table `outofstockconsumablereportingcg` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `attachmentreportingcg` ADD COLUMN `watchReportId` VARCHAR(191) NULL,
    MODIFY `reportingCgId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `hsereporting` ADD COLUMN `watchReportId` VARCHAR(191) NULL,
    MODIFY `reportingCgId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `operatorreporting` ADD COLUMN `watchReportId` VARCHAR(191) NULL,
    MODIFY `reportingCgId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `outofstockconsumablereportingcg` ADD COLUMN `watchReportId` VARCHAR(191) NULL,
    MODIFY `reportingCgId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `reportingcg` ADD COLUMN `numberPrepaidWeighDefinitivelyCompleted` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `watchreport` (
    `id` VARCHAR(191) NOT NULL,
    `numRef` VARCHAR(191) NOT NULL,
    `reportingCgId` VARCHAR(191) NOT NULL,
    `guardhouseSupervisorId` VARCHAR(191) NOT NULL,
    `customerSupportComment` LONGTEXT NULL,
    `shiftId` VARCHAR(191) NULL,
    `siteId` VARCHAR(191) NULL,
    `recipeCardNumber` VARCHAR(191) NULL,
    `completeNumberWeighingsToBeBilled` INTEGER NOT NULL DEFAULT 0,
    `completeNumberWeighingsBySpecies` INTEGER NOT NULL DEFAULT 0,
    `incompleteNumberWeighingsToBeBilled` INTEGER NOT NULL DEFAULT 0,
    `incompleteNumberWeighingsBySpecies` INTEGER NOT NULL DEFAULT 0,
    `testNumberWeighingsToBeBilled` INTEGER NOT NULL DEFAULT 0,
    `testNumberWeighingsBySpecies` INTEGER NOT NULL DEFAULT 0,
    `numberPassagesWithoutWeighingToBeBilled` INTEGER NOT NULL DEFAULT 0,
    `numberPassagesWithoutWeighingBySpecies` INTEGER NOT NULL DEFAULT 0,
    `numberPrepaidWeighDefinitivelyCompleted` INTEGER NOT NULL DEFAULT 0,
    `extractionFileUrl` VARCHAR(191) NULL,
    `numberIncidents` INTEGER NOT NULL DEFAULT 0,
    `incidentDescription` LONGTEXT NULL,
    `productionDescription` LONGTEXT NULL,
    `incomingCgId` VARCHAR(191) NOT NULL,
    `offBridgeNumber` INTEGER NOT NULL DEFAULT 0,
    `totalWeightAmount` DOUBLE NOT NULL DEFAULT 0,
    `totalWeightAmountToBeBilled` DOUBLE NOT NULL DEFAULT 0,
    `totalTestWeightAmount` DOUBLE NOT NULL DEFAULT 0,
    `totalOffBridgeAmount` DOUBLE NOT NULL DEFAULT 0,
    `firstWeighNumber` VARCHAR(191) NULL,
    `lastWeighNumber` VARCHAR(191) NULL,
    `firstWeighTractorNumber` VARCHAR(191) NULL,
    `lastWeighTractorNumber` VARCHAR(191) NULL,
    `firstWeighDate` DATETIME(3) NULL,
    `lastWeighDate` DATETIME(3) NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `watchreport_numRef_key`(`numRef`),
    UNIQUE INDEX `watchreport_reportingCgId_key`(`reportingCgId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `hsereporting_hseId_reportingCgId_key` ON `hsereporting`(`hseId`, `reportingCgId`);

-- CreateIndex
CREATE UNIQUE INDEX `hsereporting_hseId_watchReportId_key` ON `hsereporting`(`hseId`, `watchReportId`);

-- CreateIndex
CREATE UNIQUE INDEX `operatorreporting_operatorId_reportingCgId_key` ON `operatorreporting`(`operatorId`, `reportingCgId`);

-- CreateIndex
CREATE UNIQUE INDEX `operatorreporting_operatorId_watchReportId_key` ON `operatorreporting`(`operatorId`, `watchReportId`);

-- CreateIndex
CREATE UNIQUE INDEX `outofstockconsumablereportingcg_consumableId_reportingCgId_key` ON `outofstockconsumablereportingcg`(`consumableId`, `reportingCgId`);

-- CreateIndex
CREATE UNIQUE INDEX `outofstockconsumablereportingcg_consumableId_watchReportId_key` ON `outofstockconsumablereportingcg`(`consumableId`, `watchReportId`);

-- AddForeignKey
ALTER TABLE `watchreport` ADD CONSTRAINT `watchreport_reportingCgId_fkey` FOREIGN KEY (`reportingCgId`) REFERENCES `reportingcg`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `operatorreporting` ADD CONSTRAINT `operatorreporting_watchReportId_fkey` FOREIGN KEY (`watchReportId`) REFERENCES `watchreport`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hsereporting` ADD CONSTRAINT `hsereporting_watchReportId_fkey` FOREIGN KEY (`watchReportId`) REFERENCES `watchreport`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attachmentreportingcg` ADD CONSTRAINT `attachmentreportingcg_watchReportId_fkey` FOREIGN KEY (`watchReportId`) REFERENCES `watchreport`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `outofstockconsumablereportingcg` ADD CONSTRAINT `outofstockconsumablereportingcg_watchReportId_fkey` FOREIGN KEY (`watchReportId`) REFERENCES `watchreport`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
