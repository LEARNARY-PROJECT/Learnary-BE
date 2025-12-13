import { Request, Response } from 'express';
import * as CourseGroupService from '../services/courseGroup.service';
import { failure, success } from '../utils/response';

export const findCourseInGroupController = async (req: Request, res: Response) => {
  try {
    const course_id = req.params.course_id;
    if(!course_id) {
      return res.status(500).json(failure("Missing field required"))
    }
    const data = await CourseGroupService.findCourseInGroupService(course_id);
    return res.status(200).json(success(data))
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ error: err.message });
  }
}
export const addCourseToGroup = async (req: Request, res: Response) => {
  try {
    const { group_id, course_id, order_index } = req.body;

    if (!group_id || !course_id || order_index === undefined) {
      return res.status(400).json({ error: 'group_id, course_id, and order_index are required' });
    }

    const courseGroup = await CourseGroupService.addCourseToGroup({ group_id, course_id, order_index });
    return res.status(201).json(courseGroup);
  } catch (error) {
    const err = error as Error;
    if (err.message.includes('not found') || err.message.includes('already in')) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: err.message });
  }
};

export const removeCourseFromGroup = async (req: Request, res: Response) => {
  try {
    const { groupId, courseId } = req.params;
    await CourseGroupService.removeCourseFromGroup(groupId, courseId);
    return res.status(204).send();
  } catch (error) {
    const err = error as Error;
    if (err.message === 'Course not found in this group') {
      return res.status(404).json({ error: err.message });
    }
    return res.status(500).json({ error: err.message });
  }
};

export const getCoursesByGroupId = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const courses = await CourseGroupService.getCoursesByGroupId(groupId);
    return res.json(courses);
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ error: err.message });
  }
};

export const updateCourseOrder = async (req: Request, res: Response) => {
  try {
    const { groupId, courseId } = req.params;
    const { order_index } = req.body;

    if (order_index === undefined) {
      return res.status(400).json({ error: 'order_index is required' });
    }

    const courseGroup = await CourseGroupService.updateCourseOrderInGroup(groupId, courseId, order_index);
    return res.json(courseGroup);
  } catch (error) {
    const err = error as Error;
    if (err.message === 'Course not found in this group') {
      return res.status(404).json({ error: err.message });
    }
    return res.status(500).json({ error: err.message });
  }
};

export const bulkUpdateCourseOrder = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const { courses } = req.body;

    if (!Array.isArray(courses)) {
      return res.status(400).json({ error: 'courses array is required' });
    }

    const result = await CourseGroupService.bulkUpdateCourseOrder(groupId, courses);
    return res.json({ success: true, updated: result.length });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ error: err.message });
  }
};
