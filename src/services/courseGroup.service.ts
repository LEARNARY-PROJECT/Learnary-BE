import prisma from "../lib/client";

export const addCourseToGroup = async (data: {
  group_id: string;
  course_id: string;
  order_index: number;
}) => {
  const group = await prisma.group.findUnique({
    where: { group_id: data.group_id }
  });
  if (!group) {
    throw new Error('Group not found');
  }
  const course = await prisma.course.findUnique({
    where: { course_id: data.course_id }
  });
  if (!course) {
    throw new Error('Course not found');
  }
  const existing = await prisma.courseGroup.findUnique({
    where: {
      course_id_group_id: {
        course_id: data.course_id,
        group_id: data.group_id
      }
    }
  });

  if (existing) {
    throw new Error('Course already in this group');
  }

  return prisma.courseGroup.create({
    data,
    include: {
      belongToGroup: true,
      belongToCourse: {
        select: {
          course_id: true,
          title: true,
          thumbnail: true,
          price: true
        }
      }
    }
  });
};

export const removeCourseFromGroup = async (groupId: string, courseId: string) => {
  const courseGroup = await prisma.courseGroup.findUnique({
    where: {
      course_id_group_id: {
        course_id: courseId,
        group_id: groupId
      }
    }
  });

  if (!courseGroup) {
    throw new Error('Course not found in this group');
  }

  return prisma.courseGroup.delete({
    where: {
      course_id_group_id: {
        course_id: courseId,
        group_id: groupId
      }
    }
  });
};

export const getCoursesByGroupId = async (groupId: string) => {
  return prisma.courseGroup.findMany({
    where: { group_id: groupId },
    include: {
      belongToCourse: {
        select: {
          course_id: true,
          title: true,
          slug: true,
          thumbnail: true,
          description: true,
          price: true,
          status: true,
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
          },
          category:true
        }
      }
    },
    orderBy: {
      order_index: 'asc'
    }
  });
};
export const findCourseInGroupService = async (courseId:string) => {
  if(!courseId) {
    throw new Error("Not found this course")
  }
  try {
    return await prisma.courseGroup.findMany({
      where: {
        course_id:courseId.trim()
      },
      include: {
        belongToGroup: {
          select: {
            group_id:true
          }
        }
      }
    })
  } catch (error) {
    console.log(error)
    return
  }
}
export const updateCourseOrderInGroup = async (
  groupId: string,
  courseId: string,
  newOrderIndex: number
) => {
  const courseGroup = await prisma.courseGroup.findUnique({
    where: {
      course_id_group_id: {
        course_id: courseId,
        group_id: groupId
      }
    }
  });

  if (!courseGroup) {
    throw new Error('Course not found in this group');
  }

  return prisma.courseGroup.update({
    where: {
      course_id_group_id: {
        course_id: courseId,
        group_id: groupId
      }
    },
    data: {
      order_index: newOrderIndex
    },
    include: {
      belongToGroup: true,
      belongToCourse: true
    }
  });
};

export const bulkUpdateCourseOrder = async (
  groupId: string,
  courses: Array<{ course_id: string; order_index: number }>
) => {
  const updates = courses.map((course) =>
    prisma.courseGroup.update({
      where: {
        course_id_group_id: {
          course_id: course.course_id,
          group_id: groupId
        }
      },
      data: {
        order_index: course.order_index
      }
    })
  );

  return prisma.$transaction(updates);
};
