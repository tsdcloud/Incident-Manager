-- AlterTable
ALTER TABLE `offbridge` MODIFY `paymentMode` ENUM('CASH', 'MOBILE', 'BILLABLE') NOT NULL DEFAULT 'CASH';
