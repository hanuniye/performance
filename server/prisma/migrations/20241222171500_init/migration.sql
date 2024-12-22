/*
  Warnings:

  - You are about to drop the column `manag_selfareasForImprovement` on the `performancereview` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `performancereview` DROP COLUMN `manag_selfareasForImprovement`,
    ADD COLUMN `manag_areasForImprovement` VARCHAR(191) NULL;
