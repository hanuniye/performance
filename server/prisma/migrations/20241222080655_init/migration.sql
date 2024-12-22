-- CreateTable
CREATE TABLE `PerformanceReview` (
    `id` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `manager` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `fy` VARCHAR(191) NOT NULL,
    `employeeComment` VARCHAR(191) NULL,
    `managerComment` VARCHAR(191) NULL,
    `self_majorAccomplishments` VARCHAR(191) NULL,
    `self_areasForImprovement` VARCHAR(191) NULL,
    `manag_majorAccomplishments` VARCHAR(191) NULL,
    `manag_selfareasForImprovement` VARCHAR(191) NULL,
    `overallRating` VARCHAR(191) NULL,
    `managerSignature` VARCHAR(191) NULL,
    `date` DATETIME(3) NULL,
    `employeeSignature` VARCHAR(191) NULL,
    `employeeComments` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Goal` (
    `id` VARCHAR(191) NOT NULL,
    `performanceReviewId` VARCHAR(191) NOT NULL,
    `globalImpactArea` VARCHAR(191) NOT NULL,
    `coreCompetency` VARCHAR(191) NOT NULL,
    `functionalCompetency` VARCHAR(191) NOT NULL,
    `keyTasks` VARCHAR(191) NOT NULL,
    `whyImportant` VARCHAR(191) NOT NULL,
    `whenAccomplish` DATETIME(3) NOT NULL,
    `employeeQ1` VARCHAR(191) NULL,
    `employeeQ2` VARCHAR(191) NULL,
    `employeeQ3` VARCHAR(191) NULL,
    `employeeQ4` VARCHAR(191) NULL,
    `managerQ1` VARCHAR(191) NULL,
    `managerQ2` VARCHAR(191) NULL,
    `managerQ3` VARCHAR(191) NULL,
    `managerQ4` VARCHAR(191) NULL,
    `employeeFeedback` VARCHAR(191) NULL,
    `managerFeedback` VARCHAR(191) NULL,
    `selfRating` INTEGER NULL,
    `managerRating` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PerformanceReview` ADD CONSTRAINT `PerformanceReview_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Goal` ADD CONSTRAINT `Goal_performanceReviewId_fkey` FOREIGN KEY (`performanceReviewId`) REFERENCES `PerformanceReview`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
