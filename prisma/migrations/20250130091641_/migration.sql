-- AlterTable
ALTER TABLE `incident` ADD COLUMN `declarationType` ENUM('CONTAINER', 'BULK', 'CONVENTIONAL_WOOD_LOG', 'HEAVY_BULK', 'CONVENTIONAL_LUMBER') NULL;
