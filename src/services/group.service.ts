import prisma from "../lib/client";
import { Group, GroupType } from '../generated/prisma';

export const createGroup = async (data: {
  name: string;
  description: string;
  type?: GroupType;
  discount: number;
}) => {
  return prisma.group.create({
    data: {
      name: data.name,
      description: data.description,
      type: data.type || GroupType.Group,
      discount: data.discount
    },
    include: {
      hasCourseGroup: {
        include: {
          belongToCourse: {
            select: {
              course_id: true,
              title: true,
              thumbnail: true,
              price: true
            }
          }
        }
      }
    }
  });
};

export const getAllGroups = async () => {
  return prisma.group.findMany({
    include: {
      hasCourseGroup: {
        include: {
          belongToCourse: {
            select: {
              course_id: true,
              title: true,
              thumbnail: true,
              price: true,
              status: true
            }
          }
        },
        orderBy: {
          order_index: 'asc'
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const getGroupById = async (groupId: string) => {
  const group = await prisma.group.findUnique({
    where: { group_id: groupId },
    include: {
      hasCourseGroup: {
        include: {
          belongToCourse: {
            select: {
              course_id: true,
              title: true,
              slug: true,
              thumbnail: true,
              price: true,
              description: true,
              instructor: {
                select: {
                  instructor_id: true,
                  user: {
                    select: {
                      user_id: true,
                      email: true,
                      avatar: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          order_index: 'asc'
        }
      }
    }
  });

  if (!group) {
    throw new Error('Group not found');
  }

  return group;
};

export const getGroupsByType = async (type: GroupType) => {
  return prisma.group.findMany({
    where: { type },
    include: {
      hasCourseGroup: {
        include: {
          belongToCourse: {
            select: {
              course_id: true,
              title: true,
              thumbnail: true,
              price: true,
              status: true
            }
          }
        },
        orderBy: {
          order_index: 'asc'
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const updateGroup = async (groupId: string, data: {
  name?: string;
  description?: string;
  type?: GroupType;
  discount?: number;
}) => {
  const group = await prisma.group.findUnique({
    where: { group_id: groupId }
  });

  if (!group) {
    throw new Error('Group not found');
  }

  return prisma.group.update({
    where: { group_id: groupId },
    data,
    include: {
      hasCourseGroup: {
        include: {
          belongToCourse: {
            select: {
              course_id: true,
              title: true,
              thumbnail: true,
              price: true
            }
          }
        }
      }
    }
  });
};

export const deleteGroup = async (groupId: string) => {
  const group = await prisma.group.findUnique({
    where: { group_id: groupId }
  });

  if (!group) {
    throw new Error('Group not found');
  }

  return prisma.group.delete({
    where: { group_id: groupId }
  });
};
