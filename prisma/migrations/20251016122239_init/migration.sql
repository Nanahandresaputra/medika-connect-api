-- CreateTable
CREATE TABLE "media_information" (
    "id" SERIAL NOT NULL,
    "img_url" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "media_information_id_key" ON "media_information"("id");
