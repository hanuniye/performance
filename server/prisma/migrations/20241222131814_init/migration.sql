-- AlterTable
ALTER TABLE `performancereview` ADD COLUMN `status` ENUM('SUBMITTED', 'IN_REVIEW', 'APPROVED') NOT NULL DEFAULT 'SUBMITTED';
