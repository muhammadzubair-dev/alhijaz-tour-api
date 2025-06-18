/*
  Warnings:

  - A unique constraint covering the columns `[role_id,menu_id]` on the table `user_roles_menu` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_roles_menu_role_id_menu_id_key" ON "user_roles_menu"("role_id", "menu_id");
