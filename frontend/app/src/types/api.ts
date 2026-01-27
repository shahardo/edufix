// TypeScript interfaces for API responses

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  language: string;
  class_id?: number;
}

export interface DashboardMetrics {
  total_students: number;
  active_students_today: number;
  average_mastery_score: number;
  total_questions_attempted: number;
  completion_rate: number;
  top_performing_students: Array<{
    id: number;
    name: string;
    average_mastery: number;
  }>;
}

export interface StudentDashboardData {
  active_classes_count: number;
  completed_tasks_count: number;
  average_grade: number;
  current_streak: number;
  total_points: number;
  classes: Array<{
    id: number;
    name: string;
    subject: string;
    teacher_name: string;
    completed_lessons: number;
    total_lessons: number;
    next_lesson: string | null;
    grade: number;
  }>;
  recent_activity: Array<{
    type: string;
    description: string;
    timestamp: string;
    details?: string;
  }>;
  upcoming_assignments: Array<{
    title: string;
    course_name: string;
    due_date: string;
    priority: string;
    type: string;
  }>;
}

export interface TeacherClassDetails {
  class_id: number;
  class_name: string;
  subject: string;
  total_students: number;
  students: Array<{
    id: number;
    name: string;
    email: string;
    mastery_score: number;
    completed_lessons: number;
    status: string;
    recent_activity: boolean;
  }>;
  struggling_topics: Array<{
    topic: string;
    average_mastery: number;
    struggling_students: number;
    total_students: number;
  }>;
  mastery_distribution: {
    expert: number;
    advanced: number;
    intermediate: number;
    beginner: number;
  };
}

export interface StudentInsight {
  student_id: number;
  student_name: string;
  mastery_scores: Record<string, number>;
  recent_activity: Array<{
    type: string;
    start_time: string;
    duration: number | null;
    questions_attempted: number | null;
    correct_answers: number | null;
  }>;
  progress_rate: number;
  recommendations: string[];
}

export interface ClassProgress {
  lesson_id: number;
  lesson_title: string;
  average_completion: number;
  struggling_students: number;
  completed_students: number;
}

export interface InterventionSummary {
  id: number;
  student_name: string;
  intervention_type: string;
  priority: string;
  status: string;
  description: string;
  created_at: string;
}
