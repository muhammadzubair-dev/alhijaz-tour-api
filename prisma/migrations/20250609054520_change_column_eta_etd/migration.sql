/*
  Warnings:

  - You are about to alter the column `ticket_etd` on the `ticket_details` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `VarChar(5)`.
  - You are about to alter the column `ticket_eta` on the `ticket_details` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `VarChar(5)`.

*/
-- AlterTable
ALTER TABLE "ticket_details" ALTER COLUMN "ticket_etd" SET DATA TYPE VARCHAR(5),
ALTER COLUMN "ticket_eta" SET DATA TYPE VARCHAR(5);
