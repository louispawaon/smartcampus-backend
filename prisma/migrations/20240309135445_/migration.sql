/*
  Warnings:

  - A unique constraint covering the columns `[roomNum]` on the table `Facility` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roomNum` to the `Facility` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Facility" ADD COLUMN     "roomNum" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Facility_roomNum_key" ON "Facility"("roomNum");
