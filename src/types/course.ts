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
  thumbnail: string;
  price: number;
  chapter: ChapterDto[];
}
