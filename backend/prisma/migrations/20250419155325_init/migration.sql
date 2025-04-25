/*
  Warnings:

  - You are about to drop the column `profession` on the `user` table. All the data in the column will be lost.
  - Added the required column `profession_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `profession`,
    ADD COLUMN `profession_id` VARCHAR(191) NOT NULL;
