/*
  Warnings:

  - You are about to drop the column `uppdated_at` on the `agent_fee_transaction` table. All the data in the column will be lost.
  - You are about to drop the column `uppdated_at` on the `agent_sosmed` table. All the data in the column will be lost.
  - You are about to drop the column `uppdated_at` on the `agents` table. All the data in the column will be lost.
  - You are about to drop the column `uppdated_at` on the `banks` table. All the data in the column will be lost.
  - You are about to drop the column `uppdated_at` on the `fees` table. All the data in the column will be lost.
  - You are about to drop the column `uppdated_at` on the `list_api` table. All the data in the column will be lost.
  - You are about to drop the column `uppdated_at` on the `menus` table. All the data in the column will be lost.
  - You are about to drop the column `uppdated_at` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `uppdated_at` on the `social_media` table. All the data in the column will be lost.
  - You are about to drop the column `uppdated_at` on the `user_roles` table. All the data in the column will be lost.
  - You are about to drop the column `uppdated_at` on the `user_roles_menu` table. All the data in the column will be lost.
  - You are about to drop the column `uppdated_at` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "agent_fee_transaction" DROP COLUMN "uppdated_at",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "agent_sosmed" DROP COLUMN "uppdated_at",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "agents" DROP COLUMN "uppdated_at",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "banks" DROP COLUMN "uppdated_at",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "fees" DROP COLUMN "uppdated_at",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "list_api" DROP COLUMN "uppdated_at",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "menus" DROP COLUMN "uppdated_at",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "uppdated_at",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "social_media" DROP COLUMN "uppdated_at",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "user_roles" DROP COLUMN "uppdated_at",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "user_roles_menu" DROP COLUMN "uppdated_at",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "uppdated_at",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
