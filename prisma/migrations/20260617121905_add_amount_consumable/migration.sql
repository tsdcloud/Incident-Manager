-- AlterTable
ALTER TABLE `reportingcg` ADD COLUMN `firstWeighDate` DATETIME(3) NULL,
    ADD COLUMN `firstWeighNumber` VARCHAR(191) NULL,
    ADD COLUMN `firstWeighTractorNumber` VARCHAR(191) NULL,
    ADD COLUMN `lastWeighDate` DATETIME(3) NULL,
    ADD COLUMN `lastWeighNumber` VARCHAR(191) NULL,
    ADD COLUMN `lastWeighTractorNumber` VARCHAR(191) NULL,
    ADD COLUMN `offBridgeNumber` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `totalOffBridgeAmount` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `totalTestWeightAmount` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `totalWeightAmount` DOUBLE NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `consumable` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `numRef` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `consumable_name_key`(`name`),
    UNIQUE INDEX `consumable_numRef_key`(`numRef`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `weighingprice` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `numRef` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL DEFAULT 0,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `weighingprice_name_key`(`name`),
    UNIQUE INDEX `weighingprice_numRef_key`(`numRef`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `outofstockconsumablereportingcg` (
    `id` VARCHAR(191) NOT NULL,
    `consumableId` VARCHAR(191) NOT NULL,
    `reportingCgId` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `outofstockconsumablereportingcg` ADD CONSTRAINT `outofstockconsumablereportingcg_consumableId_fkey` FOREIGN KEY (`consumableId`) REFERENCES `consumable`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `outofstockconsumablereportingcg` ADD CONSTRAINT `outofstockconsumablereportingcg_reportingCgId_fkey` FOREIGN KEY (`reportingCgId`) REFERENCES `reportingcg`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
