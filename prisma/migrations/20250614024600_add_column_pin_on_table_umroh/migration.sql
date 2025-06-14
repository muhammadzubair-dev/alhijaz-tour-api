/*
  Warnings:

  - You are about to drop the column `pin` on the `umrah_registers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "umrah" ADD COLUMN     "pin" INTEGER NOT NULL DEFAULT 12345;

-- AlterTable
ALTER TABLE "umrah_registers" DROP COLUMN "pin";
