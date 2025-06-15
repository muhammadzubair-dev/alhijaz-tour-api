/*
  Warnings:

  - The primary key for the `menus` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "list_api" DROP CONSTRAINT "list_api_menu_id_fkey";

-- DropForeignKey
ALTER TABLE "user_roles_menu" DROP CONSTRAINT "user_roles_menu_menu_id_fkey";

-- AlterTable
ALTER TABLE "list_api" ALTER COLUMN "menu_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "menus" DROP CONSTRAINT "menus_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(50),
ADD CONSTRAINT "menus_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "menus_id_seq";

-- AlterTable
ALTER TABLE "user_roles_menu" ALTER COLUMN "menu_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "user_roles_menu" ADD CONSTRAINT "user_roles_menu_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_api" ADD CONSTRAINT "list_api_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
