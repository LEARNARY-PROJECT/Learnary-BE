/*
  Warnings:

  - You are about to drop the `admin_role_on_resources` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "admin_role_on_resources" DROP CONSTRAINT "admin_role_on_resources_adminRoleId_fkey";

-- DropForeignKey
ALTER TABLE "admin_role_on_resources" DROP CONSTRAINT "admin_role_on_resources_resourceTypeId_fkey";

-- DropTable
DROP TABLE "admin_role_on_resources";

-- CreateTable
CREATE TABLE "permission_on_resources" (
    "id" TEXT NOT NULL,
    "permissionId" CHAR(50) NOT NULL,
    "resourceTypeId" CHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permission_on_resources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_por_permission" ON "permission_on_resources"("permissionId");

-- CreateIndex
CREATE INDEX "idx_por_resource" ON "permission_on_resources"("resourceTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "permission_on_resources_permissionId_resourceTypeId_key" ON "permission_on_resources"("permissionId", "resourceTypeId");

-- AddForeignKey
ALTER TABLE "permission_on_resources" ADD CONSTRAINT "permission_on_resources_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("permission_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission_on_resources" ADD CONSTRAINT "permission_on_resources_resourceTypeId_fkey" FOREIGN KEY ("resourceTypeId") REFERENCES "resource_types"("resource_id") ON DELETE CASCADE ON UPDATE CASCADE;
