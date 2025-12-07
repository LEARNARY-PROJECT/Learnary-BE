    import prisma from "../lib/client";
    import { ResourceType } from '../generated/prisma';
    const DEFAULT_RESOURCE_TYPES = [
    'COURSE',
    'INSTRUCTOR',
    'CATEGORY',
    'LEVEL',
    'USER',
    'TRANSACTION',
    'ALL'
    ] as const;
    export const seedResourceTypes = async () => {
    let created = 0;
    let existing = 0;
    for (const resourceName of DEFAULT_RESOURCE_TYPES) {
        try {
        const existingResource = await prisma.resourceType.findUnique({
            where: { resource_name: resourceName }
        });
        if (!existingResource) {
            await prisma.resourceType.create({
            data: { resource_name: resourceName }
            });
            created++;
            console.log(`  ✅ Created ResourceType: ${resourceName}`);
        } else {
            existing++;
            console.log(`  ℹ️  ResourceType already exists: ${resourceName}`);
        }
        } catch (error) {
        console.error(`  ❌ Error creating ResourceType ${resourceName}:`, error);
        }
    }

    console.log(`\n✨ ResourceType seeding completed:`);
    console.log(`   - Created: ${created}`);
    console.log(`   - Already existed: ${existing}`);
    console.log(`   - Total: ${DEFAULT_RESOURCE_TYPES.length}\n`);
    };


    export const createResourceType = async (data: Omit<ResourceType, 'resource_id'>) => {
    return prisma.resourceType.create({ 
        data,
        include: {
        permissions: {
            include: {
            permission: {
                select: {
                permission_id: true,
                permission_name: true,
                description: true
                }
            }
            }
        }
        }
    });
    };

    export const getResourceTypeById = async (resource_id: string) => {
    return prisma.resourceType.findUnique({ 
        where: { resource_id },
        include: {
        permissions: {
            include: {
            permission: {
                select: {
                permission_id: true,
                permission_name: true,
                description: true
                }
            }
            }
        }
        }
    });
    };

    export const getAllResourceTypes = async () => {
    return prisma.resourceType.findMany({
        include: {
        permissions: {
            include: {
            permission: {
                select: {
                permission_id: true,
                permission_name: true,
                description: true
                }
            }
            }
        }
        },
        orderBy: {
        resource_name: 'asc'
        }
    });
    };

    export const updateResourceType = async (resource_id: string, data: Partial<ResourceType>) => {
    return prisma.resourceType.update({ 
        where: { resource_id }, 
        data,
        include: {
        permissions: {
            include: {
            permission: true
            }
        }
        }
    });
    };

    export const deleteResourceType = async (resource_id: string) => {
    return prisma.resourceType.delete({ where: { resource_id } });
    };
