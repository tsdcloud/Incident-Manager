-- CreateTable
CREATE TABLE `reportingcg` (
    `id` VARCHAR(191) NOT NULL,
    `numRef` VARCHAR(191) NOT NULL,
    `shiftId` VARCHAR(191) NULL,
    `siteId` VARCHAR(191) NULL,
    `completeNumberWeighingsToBeBilled` INTEGER NOT NULL DEFAULT 0,
    `completeNumberWeighingsBySpecies` INTEGER NOT NULL DEFAULT 0,
    `incompleteNumberWeighingsToBeBilled` INTEGER NOT NULL DEFAULT 0,
    `incompleteNumberWeighingsBySpecies` INTEGER NOT NULL DEFAULT 0,
    `testNumberWeighingsToBeBilled` INTEGER NOT NULL DEFAULT 0,
    `testNumberWeighingsBySpecies` INTEGER NOT NULL DEFAULT 0,
    `numberPassagesWithoutWeighingToBeBilled` INTEGER NOT NULL DEFAULT 0,
    `numberPassagesWithoutWeighingBySpecies` INTEGER NOT NULL DEFAULT 0,
    `extractionFileUrl` VARCHAR(191) NULL,
    `numberIncidents` INTEGER NOT NULL DEFAULT 0,
    `incidentDescription` LONGTEXT NULL,
    `productionDescription` LONGTEXT NULL,
    `incomingCgId` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `reportingcg_numRef_key`(`numRef`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `operatorreporting` (
    `id` VARCHAR(191) NOT NULL,
    `operatorId` VARCHAR(191) NOT NULL,
    `reportingCgId` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hsereporting` (
    `id` VARCHAR(191) NOT NULL,
    `hseId` VARCHAR(191) NOT NULL,
    `reportingCgId` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attachmentreportingcg` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NULL,
    `reportingCgId` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reportingsupervisory` (
    `id` VARCHAR(191) NOT NULL,
    `numRef` VARCHAR(191) NOT NULL,
    `shiftId` VARCHAR(191) NULL,
    `completeNumberWeighingsToBeBilled` INTEGER NOT NULL DEFAULT 0,
    `completeNumberWeighingsBySpecies` INTEGER NOT NULL DEFAULT 0,
    `incompleteNumberWeighingsToBeBilled` INTEGER NOT NULL DEFAULT 0,
    `incompleteNumberWeighingsBySpecies` INTEGER NOT NULL DEFAULT 0,
    `testNumberWeighingsToBeBilled` INTEGER NOT NULL DEFAULT 0,
    `testNumberWeighingsBySpecies` INTEGER NOT NULL DEFAULT 0,
    `numberPassagesWithoutWeighingToBeBilled` INTEGER NOT NULL DEFAULT 0,
    `numberPassagesWithoutWeighingBySpecies` INTEGER NOT NULL DEFAULT 0,
    `grossTonnage` DOUBLE NOT NULL DEFAULT 0,
    `productionNote` LONGTEXT NULL,
    `expectedNumberResources` INTEGER NOT NULL DEFAULT 0,
    `availableNumberResources` INTEGER NOT NULL DEFAULT 0,
    `overdueNumberResources` INTEGER NOT NULL DEFAULT 0,
    `missingNumberResources` INTEGER NOT NULL DEFAULT 0,
    `teamManagementFeedback` LONGTEXT NULL,
    `titleWorkProgress` VARCHAR(191) NULL,
    `commentWorkProgress` LONGTEXT NULL,
    `numberIncidents` INTEGER NOT NULL DEFAULT 0,
    `incidentNote` LONGTEXT NULL,
    `incomingSupervisoryId` VARCHAR(191) NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `reportingsupervisory_numRef_key`(`numRef`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `incidentreporting` (
    `id` VARCHAR(191) NOT NULL,
    `equipment` VARCHAR(191) NOT NULL,
    `breakdown` VARCHAR(191) NOT NULL,
    `typeFailure` VARCHAR(191) NOT NULL,
    `downtime` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `managerFailure` VARCHAR(191) NOT NULL,
    `reportingSupervisoryId` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chargerreporting` (
    `id` VARCHAR(191) NOT NULL,
    `chargerId` VARCHAR(191) NOT NULL,
    `reportingSupervisoryId` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shipperreporting` (
    `id` VARCHAR(191) NOT NULL,
    `shipperId` VARCHAR(191) NOT NULL,
    `reportingSupervisoryId` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `thirdpartyreporting` (
    `id` VARCHAR(191) NOT NULL,
    `thirdPartyId` VARCHAR(191) NOT NULL,
    `reportingSupervisoryId` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shipreporting` (
    `id` VARCHAR(191) NOT NULL,
    `shipId` VARCHAR(191) NOT NULL,
    `reportingSupervisoryId` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productreporting` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `reportingSupervisoryId` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attachmentreportingsupervisory` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NULL,
    `reportingSupervisoryId` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ship` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `numRef` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `ship_name_key`(`name`),
    UNIQUE INDEX `ship_numRef_key`(`numRef`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `numRef` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `product_name_key`(`name`),
    UNIQUE INDEX `product_numRef_key`(`numRef`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `operatorreporting` ADD CONSTRAINT `operatorreporting_reportingCgId_fkey` FOREIGN KEY (`reportingCgId`) REFERENCES `reportingcg`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hsereporting` ADD CONSTRAINT `hsereporting_reportingCgId_fkey` FOREIGN KEY (`reportingCgId`) REFERENCES `reportingcg`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attachmentreportingcg` ADD CONSTRAINT `attachmentreportingcg_reportingCgId_fkey` FOREIGN KEY (`reportingCgId`) REFERENCES `reportingcg`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `incidentreporting` ADD CONSTRAINT `incidentreporting_reportingSupervisoryId_fkey` FOREIGN KEY (`reportingSupervisoryId`) REFERENCES `reportingsupervisory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chargerreporting` ADD CONSTRAINT `chargerreporting_reportingSupervisoryId_fkey` FOREIGN KEY (`reportingSupervisoryId`) REFERENCES `reportingsupervisory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shipperreporting` ADD CONSTRAINT `shipperreporting_reportingSupervisoryId_fkey` FOREIGN KEY (`reportingSupervisoryId`) REFERENCES `reportingsupervisory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `thirdpartyreporting` ADD CONSTRAINT `thirdpartyreporting_reportingSupervisoryId_fkey` FOREIGN KEY (`reportingSupervisoryId`) REFERENCES `reportingsupervisory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shipreporting` ADD CONSTRAINT `shipreporting_shipId_fkey` FOREIGN KEY (`shipId`) REFERENCES `ship`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shipreporting` ADD CONSTRAINT `shipreporting_reportingSupervisoryId_fkey` FOREIGN KEY (`reportingSupervisoryId`) REFERENCES `reportingsupervisory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productreporting` ADD CONSTRAINT `productreporting_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productreporting` ADD CONSTRAINT `productreporting_reportingSupervisoryId_fkey` FOREIGN KEY (`reportingSupervisoryId`) REFERENCES `reportingsupervisory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attachmentreportingsupervisory` ADD CONSTRAINT `attachmentreportingsupervisory_reportingSupervisoryId_fkey` FOREIGN KEY (`reportingSupervisoryId`) REFERENCES `reportingsupervisory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;


