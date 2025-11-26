import prisma from "../lib/client";

export const CreateSlug = (title: String) => {
    if (!title || typeof title !== 'string') {
        return 'Error-Slug'
    }
    const slug = title.normalize("NFD")                     // tách dấu
        .replace(/[\u0300-\u036f]/g, "")      // xoá dấu
        .replace(/đ/g, "d").replace(/Đ/g, "D") // thay đ -> d
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")                 // khoảng trắng -> gạch
        .replace(/[^a-z0-9-]/g, "");          // bỏ ký tự đặc biệt
    return slug;
}
export const checkExistingSlug = async (slugNeedCheck: String): Promise<Boolean> => {
    if (!slugNeedCheck || typeof slugNeedCheck !== 'string') {
        return false
    } else {
        const course = await prisma.course.findFirst({
            where: {
                slug: slugNeedCheck
            }
        })
        if (course) return true
        else return false
    }
}