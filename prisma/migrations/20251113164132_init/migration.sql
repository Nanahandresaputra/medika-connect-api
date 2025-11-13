/*
  Warnings:

  - Added the required column `status` to the `appoitment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "appoitment_status" AS ENUM ('reserved', 'completed', 'canceled');

-- AlterTable
ALTER TABLE "appoitment" ADD COLUMN     "status" "appoitment_status" NOT NULL;
