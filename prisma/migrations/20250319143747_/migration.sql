-- CreateTable
CREATE TABLE `_IncidentCauseToIncidentType` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_IncidentCauseToIncidentType_AB_unique`(`A`, `B`),
    INDEX `_IncidentCauseToIncidentType_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_IncidentCauseToIncidentType` ADD CONSTRAINT `_IncidentCauseToIncidentType_A_fkey` FOREIGN KEY (`A`) REFERENCES `IncidentCause`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_IncidentCauseToIncidentType` ADD CONSTRAINT `_IncidentCauseToIncidentType_B_fkey` FOREIGN KEY (`B`) REFERENCES `IncidentType`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
