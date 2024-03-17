/*
  Warnings:

  - You are about to drop the column `description` on the `Equipment` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Equipment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Equipment" DROP COLUMN "description",
DROP COLUMN "quantity";

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "equipmentQty" INTEGER[] DEFAULT ARRAY[0]::INTEGER[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "idNum" TEXT;
