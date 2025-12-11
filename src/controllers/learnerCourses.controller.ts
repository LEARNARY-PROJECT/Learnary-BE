import { Request, Response } from "express";
import * as LearnerCoursesService from "../services/learnerCourses.service";
import { success, failure } from "../utils/response";

export const create = async (req: Request, res: Response) => {
  try {
    const leanrerCourse = await LearnerCoursesService.createLearnerCourse(req.body);
    res.status(201).json(success(leanrerCourse, "LeanrerCourse created successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to create leanrerCourse", e.message));
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const learner_id =  req.params.learner_id;
    const course_id =  req.params.course_id;
    if(!course_id || !learner_id) {
      res.status(500).json(failure("Missing field required!"));
    }
    const leanrerCourse = await LearnerCoursesService.getLearnerCourseById(learner_id,course_id);
    if (!leanrerCourse) {
      res.status(404).json(failure("LeanrerCourse not found"));
      return;
    }
    res.json(success(leanrerCourse, "LeanrerCourse fetched successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch leanrerCourse", e.message));
  }
};

export const getAll = async (_: Request, res: Response) => {
  try {
    const leanrerCourses = await LearnerCoursesService.getAllLearnerCourses();
    res.json(success(leanrerCourses, "All leanrerCourses fetched successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch leanrerCourses", e.message));
  }
};
export const verifyLearnerCourseC = async (req: Request, res: Response) => {
  try {
    const course_id = req.params.id
    if(!course_id || !req.jwtPayload) {
      return res.status(404).json(failure("Missing field required"))
    } 
    const learnerCourse = await LearnerCoursesService.VerifyLearnerCourse(req.jwtPayload?.id, course_id);
    if(learnerCourse) {
      return res.status(200).json(success(learnerCourse,"Accepted."))
    } else { 
      return res.status(403).json(failure("You don't have permission to access this course!"))
    }
  } catch (error) {
    const e = error as Error;
    res.status(500).json(failure("Failed to fetch leanrerCourses", e.message));
  }
}
export const getCoursesByLearner = async (req: Request, res: Response) => {
  try {
    const { learner_id } = req.params;
    if (!learner_id) {
      return res.status(400).json(failure("learner_id is required"));
    }

    const courses = await LearnerCoursesService.getCoursesByLearnerId(learner_id);
    res.json(success(courses, "Courses fetched successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch courses", e.message));
  }
};

export const getMyCourses = async (req: Request, res: Response) => {
  try {
    const user_id = req.jwtPayload?.id;
    
    if (!user_id) {
      return res.status(401).json(failure("Unauthorized"));
    }

    const courses = await LearnerCoursesService.getCoursesByLearnerUserId(user_id);
    res.json(success(courses, "Your courses fetched successfully"));
  } catch (err) {
    const e = err as Error;
    if (e.message === 'Learner not found') {
      return res.status(404).json(failure("Learner not found"));
    }
    res.status(500).json(failure("Failed to fetch courses", e.message));
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const learner_id =  req.params.learner_id;
    const course_id =  req.params.course_id;
    if(!course_id || !learner_id) {
      res.status(500).json(failure("Missing field required!"));
    }
    const updated = await LearnerCoursesService.updateLearnerCourse(learner_id,course_id, req.body);
    res.json(success(updated, "LeanrerCourse updated successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to update leanrerCourse", e.message));
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const learner_id =  req.params.learner_id;
    const course_id =  req.params.course_id;
    if(!course_id || !learner_id) {
      res.status(500).json(failure("Missing field required!"));
    }
    await LearnerCoursesService.deleteLearnerCourse(learner_id,course_id);
    res.json(success(null, "LeanrerCourse deleted successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to delete leanrerCourse", e.message));
  }
};
