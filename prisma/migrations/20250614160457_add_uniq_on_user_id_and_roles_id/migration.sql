/*
  Warnings:

  - A unique constraint covering the columns `[user_id,roles_id]` on the table `user_roles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_roles_id_key" ON "user_roles"("user_id", "roles_id");
