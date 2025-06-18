-- CreateTable
CREATE TABLE `incidenttype` (
    `id` VARCHAR(191) NOT NULL,
    `numRef` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `incidenttype_numRef_key`(`numRef`),
    UNIQUE INDEX `incidenttype_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `incidentcause` (
    `id` VARCHAR(191) NOT NULL,
    `numRef` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `incidentcause_numRef_key`(`numRef`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipment` (
    `id` VARCHAR(191) NOT NULL,
    `numRef` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `operatingMode` DOUBLE NOT NULL DEFAULT 0,
    `siteId` VARCHAR(191) NULL,
    `startUpDate` DATETIME(3) NULL,
    `lifeSpan` DOUBLE NOT NULL DEFAULT 0,
    `scrapDate` DATETIME(3) NULL,
    `equipmentGroupId` VARCHAR(191) NOT NULL,
    `lastMaintenance` DATETIME(3) NULL,
    `periodicity` DOUBLE NOT NULL,
    `status` ENUM('NEW', 'SECOND_HAND') NOT NULL DEFAULT 'NEW',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,

    UNIQUE INDEX `equipment_numRef_key`(`numRef`),
    UNIQUE INDEX `equipment_title_key`(`title`),
    INDEX `equipment_equipmentGroupId_fkey`(`equipmentGroupId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `history` (
    `id` VARCHAR(191) NOT NULL,
    `movementId` VARCHAR(191) NOT NULL,
    `operationId` VARCHAR(191) NOT NULL,
    `maintenanceId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,

    INDEX `history_maintenanceId_fkey`(`maintenanceId`),
    INDEX `history_movementId_fkey`(`movementId`),
    INDEX `history_operationId_fkey`(`operationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movement` (
    `id` VARCHAR(191) NOT NULL,
    `equipementId` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `destinationSite` VARCHAR(191) NOT NULL,
    `originSite` VARCHAR(191) NOT NULL,

    INDEX `movement_equipementId_fkey`(`equipementId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `operation` (
    `id` VARCHAR(191) NOT NULL,
    `siteId` VARCHAR(191) NOT NULL,
    `equipementId` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `actionType` ENUM('START', 'STOP', 'REFUEL') NOT NULL,
    `content` VARCHAR(191) NULL,

    INDEX `operation_equipementId_fkey`(`equipementId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `consommable` (
    `id` VARCHAR(191) NOT NULL,
    `numRef` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `consommable_numRef_key`(`numRef`),
    UNIQUE INDEX `consommable_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `maintenancetype` (
    `id` VARCHAR(191) NOT NULL,
    `numRef` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `hasIncident` BOOLEAN NOT NULL DEFAULT false,
    `hasProjectionDate` BOOLEAN NOT NULL DEFAULT true,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `maintenancetype_numRef_key`(`numRef`),
    UNIQUE INDEX `maintenancetype_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `incident` (
    `id` VARCHAR(191) NOT NULL,
    `numRef` VARCHAR(191) NOT NULL,
    `incidentId` VARCHAR(191) NOT NULL,
    `equipementId` VARCHAR(191) NULL,
    `siteId` VARCHAR(191) NULL,
    `shiftId` VARCHAR(191) NULL,
    `consomableId` VARCHAR(191) NULL,
    `incidentCauseId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `description` LONGTEXT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `closedBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'CLOSED', 'UNDER_MAINTENANCE') NOT NULL DEFAULT 'PENDING',
    `creationDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `closedDate` DATETIME(3) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `technician` VARCHAR(191) NULL,

    UNIQUE INDEX `incident_numRef_key`(`numRef`),
    INDEX `incident_consomableId_fkey`(`consomableId`),
    INDEX `incident_equipementId_fkey`(`equipementId`),
    INDEX `incident_incidentCauseId_fkey`(`incidentCauseId`),
    INDEX `incident_incidentId_fkey`(`incidentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `offbridge` (
    `id` VARCHAR(191) NOT NULL,
    `numRef` VARCHAR(191) NOT NULL,
    `incidentCauseId` VARCHAR(191) NOT NULL,
    `operation` ENUM('IMPORT', 'EXPORT', 'TRANSIT', 'OTHERS') NULL,
    `declarationType` ENUM('CONTAINER', 'BULK', 'CONVENTIONAL_WOOD_LOG', 'HEAVY_BULK', 'CONVENTIONAL_LUMBER') NULL,
    `siteId` VARCHAR(191) NOT NULL,
    `tier` VARCHAR(191) NOT NULL,
    `container1` VARCHAR(191) NULL,
    `container2` VARCHAR(191) NULL,
    `plomb1` VARCHAR(191) NULL,
    `plomb2` VARCHAR(191) NULL,
    `loader` VARCHAR(191) NOT NULL,
    `product` VARCHAR(191) NOT NULL,
    `transporter` VARCHAR(191) NOT NULL,
    `vehicle` VARCHAR(191) NOT NULL,
    `blNumber` VARCHAR(191) NULL,
    `driver` VARCHAR(191) NOT NULL,
    `trailer` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `paymentMode` ENUM('CASH', 'MOBILE', 'BILLABLE') NOT NULL DEFAULT 'CASH',

    UNIQUE INDEX `offbridge_numRef_key`(`numRef`),
    INDEX `offbridge_incidentCauseId_fkey`(`incidentCauseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `maintenance` (
    `id` VARCHAR(191) NOT NULL,
    `numRef` VARCHAR(191) NOT NULL,
    `incidentId` VARCHAR(191) NULL,
    `equipementId` VARCHAR(191) NOT NULL,
    `siteId` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'CLOSED') NOT NULL DEFAULT 'PENDING',
    `projectedDate` DATETIME(3) NULL,
    `nextMaintenance` DATETIME(3) NULL,
    `effectifDate` DATETIME(3) NULL,
    `description` VARCHAR(191) NULL,
    `supplierId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `closedDate` DATETIME(3) NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `validationBy` VARCHAR(191) NULL,
    `rejectedBy` VARCHAR(191) NULL,
    `closedBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `maintenance` ENUM('CORRECTION', 'PALLIATIVE', 'CURATIVE', 'PROGRAMMED') NOT NULL,

    UNIQUE INDEX `maintenance_numRef_key`(`numRef`),
    UNIQUE INDEX `maintenance_incidentId_key`(`incidentId`),
    INDEX `maintenance_equipementId_fkey`(`equipementId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipmentgroup` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `numRef` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `equipmentGroup_name_key`(`name`),
    UNIQUE INDEX `equipmentGroup_numRef_key`(`numRef`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_incidentcausetoincidenttype` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_incidentcausetoincidenttype_AB_unique`(`A`, `B`),
    INDEX `_incidentcausetoincidenttype_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `equipment` ADD CONSTRAINT `equipment_equipmentGroupId_fkey` FOREIGN KEY (`equipmentGroupId`) REFERENCES `equipmentgroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `history` ADD CONSTRAINT `history_maintenanceId_fkey` FOREIGN KEY (`maintenanceId`) REFERENCES `maintenance`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `history` ADD CONSTRAINT `history_movementId_fkey` FOREIGN KEY (`movementId`) REFERENCES `movement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `history` ADD CONSTRAINT `history_operationId_fkey` FOREIGN KEY (`operationId`) REFERENCES `operation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movement` ADD CONSTRAINT `movement_equipementId_fkey` FOREIGN KEY (`equipementId`) REFERENCES `equipment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `operation` ADD CONSTRAINT `operation_equipementId_fkey` FOREIGN KEY (`equipementId`) REFERENCES `equipment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `incident` ADD CONSTRAINT `incident_consomableId_fkey` FOREIGN KEY (`consomableId`) REFERENCES `consommable`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `incident` ADD CONSTRAINT `incident_equipementId_fkey` FOREIGN KEY (`equipementId`) REFERENCES `equipment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `incident` ADD CONSTRAINT `incident_incidentCauseId_fkey` FOREIGN KEY (`incidentCauseId`) REFERENCES `incidentcause`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `incident` ADD CONSTRAINT `incident_incidentId_fkey` FOREIGN KEY (`incidentId`) REFERENCES `incidenttype`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `offbridge` ADD CONSTRAINT `offbridge_incidentCauseId_fkey` FOREIGN KEY (`incidentCauseId`) REFERENCES `incidentcause`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `maintenance` ADD CONSTRAINT `maintenance_equipementId_fkey` FOREIGN KEY (`equipementId`) REFERENCES `equipment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `maintenance` ADD CONSTRAINT `maintenance_incidentId_fkey` FOREIGN KEY (`incidentId`) REFERENCES `incident`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_incidentcausetoincidenttype` ADD CONSTRAINT `_incidentcausetoincidenttype_A_fkey` FOREIGN KEY (`A`) REFERENCES `incidentcause`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_incidentcausetoincidenttype` ADD CONSTRAINT `_incidentcausetoincidenttype_B_fkey` FOREIGN KEY (`B`) REFERENCES `incidenttype`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
