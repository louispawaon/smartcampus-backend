/*
  Warnings:

  - You are about to drop the `Equipment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Equipment" DROP CONSTRAINT "Equipment_reservationId_fkey";

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "equipments" TEXT[];

-- DropTable
DROP TABLE "Equipment";
