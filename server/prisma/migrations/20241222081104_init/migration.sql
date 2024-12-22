/*
  Warnings:

  - You are about to drop the column `date` on the `performancereview` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `performancereview` DROP COLUMN `date`,
    ADD COLUMN `employeeDate` DATETIME(3) NULL,
    ADD COLUMN `managerDate` DATETIME(3) NULL;
