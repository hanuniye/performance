/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `Users_supervisorId_fkey`;

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `supervisorId` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
