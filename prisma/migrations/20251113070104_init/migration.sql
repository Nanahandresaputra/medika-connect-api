/*
  Warnings:

  - Added the required column `ext_img_id` to the `doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img_profile` to the `doctor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "doctor" ADD COLUMN     "ext_img_id" TEXT NOT NULL,
ADD COLUMN     "img_profile" TEXT NOT NULL;
