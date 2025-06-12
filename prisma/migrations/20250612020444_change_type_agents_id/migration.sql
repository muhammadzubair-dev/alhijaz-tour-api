/*
  Warnings:

  - The `agents_id` column on the `jamaah` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "jamaah" DROP COLUMN "agents_id",
ADD COLUMN     "agents_id" INTEGER;

-- AddForeignKey
ALTER TABLE "jamaah" ADD CONSTRAINT "jamaah_agents_id_fkey" FOREIGN KEY ("agents_id") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;
