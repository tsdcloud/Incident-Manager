-- AlterTable
ALTER TABLE `equipmentgroup` ADD COLUMN `equipmentGroupFamilyId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `equipmentGroupFamily` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `numRef` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `equipmentGroupFamily_name_key`(`name`),
    UNIQUE INDEX `equipmentGroupFamily_numRef_key`(`numRef`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `equipmentgroup` ADD CONSTRAINT `equipmentgroup_equipmentGroupFamilyId_fkey` FOREIGN KEY (`equipmentGroupFamilyId`) REFERENCES `equipmentGroupFamily`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
