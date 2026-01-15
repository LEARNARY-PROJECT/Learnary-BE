 import prisma from '../lib/client';

export const createFeedback = async (data: {
    user_id: string;
    course_id: string;
    rating: number;
    comment: string;
}) => {
    const checkExistingFeedback = await prisma.feedback.findUnique({
        where: {
            course_id_user_id: {
                course_id: data.course_id,
                user_id: data.user_id
            }
        }
    })
    if(checkExistingFeedback) {
        throw new Error("You already feedback on this course")
    }
    const learner = await prisma.learner.findUnique({
        where: { user_id: data.user_id }
    });
    if (!learner) {
        throw new Error("User is not a learner");
    }

    const learnerCourse = await prisma.learnerCourses.findUnique({
        where: {
            learner_id_course_id: {
                learner_id: learner.learner_id,
                course_id: data.course_id
            }
        }
    });
    if (!learnerCourse) {
        throw new Error("You must enroll in this course before giving feedback");
    }
    const progress = parseFloat(learnerCourse.progress.toString());
    if (progress < 30) {
        throw new Error(`You must complete at least 30% of the course before giving feedback. Current progress: ${progress.toFixed(1)}%`);
    }
    return await prisma.feedback.create({
        data: {
            user_id:data.user_id,
            course_id:data.course_id,
            rating:data.rating,
            comment:data.comment
        }
    });
};

export const getFeedbackByCourse = async (course_id: string) => {
    return await prisma.feedback.findMany({
        where: { course_id },
        include: {
            user: {
                select: {
                    user_id: true,
                    fullName: true,
                    avatar: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
};
