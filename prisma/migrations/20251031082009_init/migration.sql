/*
  Warnings:

  - Added the required column `appoitment_code` to the `appoitment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "appoitment" ADD COLUMN     "appoitment_code" TEXT NOT NULL;
