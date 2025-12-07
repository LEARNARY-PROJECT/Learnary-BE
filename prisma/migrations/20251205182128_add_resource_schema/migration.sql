/*
  Warnings:

  - You are about to drop the column `resource_type` on the `admin_roles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "admin_roles" DROP COLUMN "resource_type";

-- DropEnum
DROP TYPE "ResourceType";

-- CreateTable
CREATE TABLE "resource_types" (
    "resource_id" CHAR(50) NOT NULL,
    "resource_name" TEXT NOT NULL,

    CONSTRAINT "resource_types_pkey" PRIMARY KEY ("resource_id")
);

-- CreateTable
CREATE TABLE "admin_role_on_resources" (
    "id" TEXT NOT NULL,
    "adminRoleId" TEXT NOT NULL,
    "resourceTypeId" TEXT NOT NULL,

    CONSTRAINT "admin_role_on_resources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "resource_types_resource_name_key" ON "resource_types"("resource_name");

-- CreateIndex
CREATE UNIQUE INDEX "admin_role_on_resources_adminRoleId_resourceTypeId_key" ON "admin_role_on_resources"("adminRoleId", "resourceTypeId");

-- AddForeignKey
ALTER TABLE "admin_role_on_resources" ADD CONSTRAINT "admin_role_on_resources_adminRoleId_fkey" FOREIGN KEY ("adminRoleId") REFERENCES "admin_roles"("admin_role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_role_on_resources" ADD CONSTRAINT "admin_role_on_resources_resourceTypeId_fkey" FOREIGN KEY ("resourceTypeId") REFERENCES "resource_types"("resource_id") ON DELETE RESTRICT ON UPDATE CASCADE;
