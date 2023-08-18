/*
  Warnings:

  - You are about to drop the `_rol_user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_rol_user` DROP FOREIGN KEY `_Rol_User_A_fkey`;

-- DropForeignKey
ALTER TABLE `_rol_user` DROP FOREIGN KEY `_Rol_User_B_fkey`;

-- DropTable
DROP TABLE `_rol_user`;

-- CreateTable
CREATE TABLE `roles_user` (
    `userId` INTEGER NOT NULL,
    `rolId` INTEGER NOT NULL,
    `addedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `userId`(`userId`),
    PRIMARY KEY (`rolId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `roles_user` ADD CONSTRAINT `roles_user_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roles_user` ADD CONSTRAINT `roles_user_rolId_fkey` FOREIGN KEY (`rolId`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
