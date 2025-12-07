import prisma from "../lib/client";
import { PermissionOnResource } from '../generated/prisma';

export const createPermissionOnResource = async (
  permissionId: string, 
  resourceTypeId: string
) => {
  return prisma.permissionOnResource.create({
    data: {
      permissionId,
      resourceTypeId
    },
    include: {
      permission: {
        select: {
          permission_id: true,
          permission_name: true,
          description: true
        }
      },
      resource: {
        select: {
          resource_id: true,
          resource_name: true
        }
      }
    }
  });
};

export const getPermissionOnResourceById = async (id: string) => {
  return prisma.permissionOnResource.findUnique({
    where: { id },
    include: {
      permission: true,
      resource: true
    }
  });
};

export const getAllPermissionOnResources = async () => {
  return prisma.permissionOnResource.findMany({
    include: {
      permission: {
        select: {
          permission_id: true,
          permission_name: true,
          description: true
        }
      },
      resource: {
        select: {
          resource_id: true,
          resource_name: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const getResourcesByPermissionId = async (permissionId: string) => {
  return prisma.permissionOnResource.findMany({
    where: { permissionId },
    include: {
      resource: true
    }
  });
};

export const getPermissionsByResourceId = async (resourceTypeId: string) => {
  return prisma.permissionOnResource.findMany({
    where: { resourceTypeId },
    include: {
      permission: true
    }
  });
};

export const deletePermissionOnResource = async (id: string) => {
  const existing = await prisma.permissionOnResource.findUnique({ 
    where: { id } 
  });
  
  if (!existing) {
    throw new Error(`PermissionOnResource with id ${id} not found`);
  }
  
  return prisma.permissionOnResource.delete({ where: { id } });
};

export const deleteByPermissionAndResource = async (
  permissionId: string, 
  resourceTypeId: string
) => {
  const existing = await prisma.permissionOnResource.findUnique({
    where: {
      permissionId_resourceTypeId: {
        permissionId,
        resourceTypeId
      }
    }
  });
  
  if (!existing) {
    throw new Error(`No assignment found for permission ${permissionId} and resource ${resourceTypeId}`);
  }
  
  return prisma.permissionOnResource.delete({
    where: {
      permissionId_resourceTypeId: {
        permissionId,
        resourceTypeId
      }
    }
  });
};


export const assignResourcesToPermission = async (
  permissionId: string, 
  resourceTypeIds: string[]
) => {
  await prisma.permissionOnResource.deleteMany({
    where: { permissionId }
  });

  const assignments = resourceTypeIds.map(resourceTypeId => ({
    permissionId,
    resourceTypeId
  }));

  return prisma.permissionOnResource.createMany({
    data: assignments
  });
};

export const assignPermissionsToResource = async (
  resourceTypeId: string,
  permissionIds: string[]
) => {
  await prisma.permissionOnResource.deleteMany({
    where: { resourceTypeId }
  });

  const assignments = permissionIds.map(permissionId => ({
    permissionId,
    resourceTypeId
  }));

  return prisma.permissionOnResource.createMany({
    data: assignments
  });
};
