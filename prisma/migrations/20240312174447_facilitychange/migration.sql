/*
  Warnings:

  - You are about to drop the column `availability` on the `Facility` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Facility" DROP COLUMN "availability",
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "capacity" DROP NOT NULL;
