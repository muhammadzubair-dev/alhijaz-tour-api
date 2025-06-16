/*
  Warnings:

  - You are about to drop the column `user_role_id` on the `user_roles_menu` table. All the data in the column will be lost.
  - Added the required column `role_id` to the `user_roles_menu` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_roles_menu" DROP CONSTRAINT "user_roles_menu_user_role_id_fkey";

-- AlterTable
ALTER TABLE "user_roles_menu" DROP COLUMN "user_role_id",
ADD COLUMN     "role_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "user_roles_menu" ADD CONSTRAINT "user_roles_menu_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
