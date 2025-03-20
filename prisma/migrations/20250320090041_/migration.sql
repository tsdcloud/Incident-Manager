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

    UNIQUE INDEX `incidentcause_numRef_key`(`numRef`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipement` (
    `id` VARCHAR(191) NOT NULL,
    `numRef` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `siteId` VARCHAR(191) NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `equipement_numRef_key`(`numRef`),
    UNIQUE INDEX `equipement_name_key`(`name`),
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
    `description` VARCHAR(191) NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `closedBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'CLOSED', 'UNDER_MAINTENANCE') NOT NULL DEFAULT 'PENDING',
    `creationDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `closedDate` DATETIME(3) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `incident_numRef_key`(`numRef`),
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

    UNIQUE INDEX `offbridge_numRef_key`(`numRef`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `maintenance` (
    `id` VARCHAR(191) NOT NULL,
    `numRef` VARCHAR(191) NOT NULL,
    `maintenanceId` VARCHAR(191) NOT NULL,
    `incidentId` VARCHAR(191) NULL,
    `equipementId` VARCHAR(191) NOT NULL,
    `siteId` VARCHAR(191) NOT NULL,
    `status` ENUM('AWAITING_VALIDATION', 'PENDING', 'CLOSED') NOT NULL DEFAULT 'PENDING',
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

    UNIQUE INDEX `maintenance_numRef_key`(`numRef`),
    UNIQUE INDEX `maintenance_incidentId_key`(`incidentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_incidentcauseToincidenttype` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_incidentcauseToincidenttype_AB_unique`(`A`, `B`),
    INDEX `_incidentcauseToincidenttype_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `incident` ADD CONSTRAINT `incident_incidentId_fkey` FOREIGN KEY (`incidentId`) REFERENCES `incidenttype`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `incident` ADD CONSTRAINT `incident_equipementId_fkey` FOREIGN KEY (`equipementId`) REFERENCES `equipement`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `incident` ADD CONSTRAINT `incident_consomableId_fkey` FOREIGN KEY (`consomableId`) REFERENCES `consommable`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `incident` ADD CONSTRAINT `incident_incidentCauseId_fkey` FOREIGN KEY (`incidentCauseId`) REFERENCES `incidentcause`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `offbridge` ADD CONSTRAINT `offbridge_incidentCauseId_fkey` FOREIGN KEY (`incidentCauseId`) REFERENCES `incidentcause`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `maintenance` ADD CONSTRAINT `maintenance_maintenanceId_fkey` FOREIGN KEY (`maintenanceId`) REFERENCES `maintenancetype`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `maintenance` ADD CONSTRAINT `maintenance_incidentId_fkey` FOREIGN KEY (`incidentId`) REFERENCES `incident`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `maintenance` ADD CONSTRAINT `maintenance_equipementId_fkey` FOREIGN KEY (`equipementId`) REFERENCES `equipement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_incidentcauseToincidenttype` ADD CONSTRAINT `_incidentcauseToincidenttype_A_fkey` FOREIGN KEY (`A`) REFERENCES `incidentcause`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_incidentcauseToincidenttype` ADD CONSTRAINT `_incidentcauseToincidenttype_B_fkey` FOREIGN KEY (`B`) REFERENCES `incidenttype`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
