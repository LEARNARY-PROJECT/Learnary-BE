export interface OptionDto {
  option_content: string;
  is_correct: boolean;
}

export interface QuestionDto {
  title: string;
  options: OptionDto[];
}

export interface QuizDto {
  title: string;
  questions: QuestionDto[];
}

export interface LessonDto {
  lesson_id?: string;
  title: string;
  duration?: string;
  video_url?: string;
}

export interface ChapterDto {
  chapter_title: string;
  lessons?: LessonDto[];
  quiz?: QuizDto | null;
}

export interface CourseCreateDto {
  category_id: string;
  level_id: string;
  title: string;
  requirement: string;
  description: string;
  thumbnail?: string;
  price: number;
  sale_off?: number | null; // phần trăm giảm giá
  hot?: boolean | null;
  chapter?: ChapterDto[];
}

export interface CreateSubmissionDTO {
  quiz_id: string;
  user_id: string;
  duration?: string;
  is_completed?: boolean;
  answers: Array<{
    question_id: string;
    option_id: string;
  }>;
}

export interface SubmissionResponse {
  success: boolean;
  data?: {
    submission_id: string;
    quiz_id: string;
    user_id: string;
    is_completed: boolean;
    duration: string;
    createdAt: Date;
    updatedAt: Date;
    submittedAt: Date;
    right_answer_count: number;
    answers: Array<{
      answer_id: string;
      question_id: string;
      option_id: string;
      is_correct: boolean;
    }>;
  };
  error?: {
    code: string;
    message: string;
    details?:string;
  };
}
