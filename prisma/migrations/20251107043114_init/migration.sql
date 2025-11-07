/*
  Warnings:

  - Added the required column `ext_img_id` to the `media_information` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "media_information" ADD COLUMN     "ext_img_id" TEXT NOT NULL;
