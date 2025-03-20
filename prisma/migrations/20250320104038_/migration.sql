-- AlterTable
ALTER TABLE `offbridge` ADD COLUMN `paymentMode` ENUM('CASH', 'MOBILE') NOT NULL DEFAULT 'CASH';
