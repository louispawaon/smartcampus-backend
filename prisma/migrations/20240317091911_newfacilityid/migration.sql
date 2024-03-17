/*
  Warnings:

  - The primary key for the `Facility` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Facility` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `facilityId` on the `Feedback` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `facilityId` on the `Reservation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_facilityId_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_facilityId_fkey";

-- AlterTable
ALTER TABLE "Facility" DROP CONSTRAINT "Facility_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Facility_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Feedback" DROP COLUMN "facilityId",
ADD COLUMN     "facilityId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "facilityId",
ADD COLUMN     "facilityId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_userId_facilityId_key" ON "Reservation"("userId", "facilityId");

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
