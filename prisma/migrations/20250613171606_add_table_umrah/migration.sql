/*
  Warnings:

  - You are about to drop the column `umrah_register_code` on the `umrah_payments` table. All the data in the column will be lost.
  - You are about to drop the column `package` on the `umrah_registers` table. All the data in the column will be lost.
  - Added the required column `umrah_register_id` to the `umrah_payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "umrah_payments" DROP CONSTRAINT "umrah_payments_umrah_register_code_fkey";

-- DropForeignKey
ALTER TABLE "umrah_registers" DROP CONSTRAINT "umrah_registers_package_fkey";

-- DropForeignKey
ALTER TABLE "umrah_registers" DROP CONSTRAINT "umrah_registers_package_room_price_fkey";

-- DropIndex
DROP INDEX "umrah_registers_umroh_code_key";

-- AlterTable
ALTER TABLE "umrah_payments" DROP COLUMN "umrah_register_code",
ADD COLUMN     "umrah_register_id" VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE "umrah_registers" DROP COLUMN "package",
ALTER COLUMN "package_room_price" DROP NOT NULL;

-- CreateTable
CREATE TABLE "umrah" (
    "umroh_code" VARCHAR(20) NOT NULL,
    "package" VARCHAR(20) NOT NULL,
    "created_by" TEXT DEFAULT 'system',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT DEFAULT 'system',
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "umrah_pkey" PRIMARY KEY ("umroh_code")
);

-- AddForeignKey
ALTER TABLE "umrah" ADD CONSTRAINT "umrah_package_fkey" FOREIGN KEY ("package") REFERENCES "packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "umrah_registers" ADD CONSTRAINT "umrah_registers_package_room_price_fkey" FOREIGN KEY ("package_room_price") REFERENCES "package_room_prices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "umrah_registers" ADD CONSTRAINT "umrah_registers_umroh_code_fkey" FOREIGN KEY ("umroh_code") REFERENCES "umrah"("umroh_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "umrah_payments" ADD CONSTRAINT "umrah_payments_umrah_register_id_fkey" FOREIGN KEY ("umrah_register_id") REFERENCES "umrah_registers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
