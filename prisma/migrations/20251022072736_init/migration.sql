/*
  Warnings:

  - Added the required column `status` to the `schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schedule" ADD COLUMN     "status" INTEGER NOT NULL;
