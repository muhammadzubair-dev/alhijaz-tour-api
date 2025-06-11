-- AlterTable
ALTER TABLE "umrah_registers" ADD COLUMN     "other_expenses" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "office_discount" SET DEFAULT 0,
ALTER COLUMN "agent_discount" SET DEFAULT 0;
