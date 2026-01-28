import React from 'react';
import type { User } from '../types/api';

// Mock user data for testing
export const mockUsers = {
  student: {
    id: 1,
    username: 'student1',
    full_name: 'John Student',
    role: 'student' as const,
    email: 'john.student@edufix.com'
  },
  teacher: {
    id: 2,
    username: 'teacher1',
    full_name: 'Jane Teacher',
    role: 'teacher' as const,
    email: 'jane.teacher@edufix.com'
  },
  manager: {
    id: 3,
    username: 'manager',
    full_name: 'Bob Manager',
    role: 'manager' as const,
    email: 'bob.manager@edufix.com'
  }
};

// Mock API responses
export const mockApiResponses = {
  studentDashboard: {
    active_classes_count: 4,
    completed_tasks_count: 23,
    average_grade: 87,
    current_streak: 5,
    classes: [
      {
        id: 1,
        name: 'Chemistry 101',
        teacher_name: 'Dr. Smith',
        grade: 85
      },
      {
        id: 2,
        name: 'Physics 101',
        teacher_name: 'Prof. Johnson',
        grade: 90
      }
    ],
    recent_activity: [
      {
        id: 1,
        description: 'Completed Chemistry quiz',
        timestamp: '2024-01-15T10:30:00Z',
        details: 'Score: 88%'
      },
      {
        id: 2,
        description: 'Submitted Physics homework',
        timestamp: '2024-01-14T15:45:00Z',
        details: 'On time submission'
      }
    ],
    upcoming_assignments: [
      {
        id: 1,
        title: 'Biology Lab Report',
        course_name: 'Biology 101',
        due_date: '2024-01-20T23:59:00Z'
      },
      {
        id: 2,
        title: 'Math Problem Set',
        course_name: 'Calculus I',
        due_date: '2024-01-18T23:59:00Z'
      }
    ]
  },

  teacherDashboard: {
    total_students: 26,
    completion_rate: 92,
    average_mastery_score: 78,
    active_students_today: 24,
    classes: [
      { id: 1, name: 'Chemistry 10B', studentCount: 26 },
      { id: 2, name: 'Physics 10A', studentCount: 24 }
    ]
  },

  managerDashboard: {
    total_teachers: 8,
    total_students: 245,
    total_classes: 12,
    total_lessons: 156,
    teachers: [
      {
        id: 1,
        full_name: 'Dr. Smith',
        email: 'smith@edufix.com',
        class_count: 3,
        student_count: 78
      }
    ]
  }
};

// Mock localStorage data
export const mockLocalStorageData = {
  token: 'mock-jwt-token-12345',
  user: JSON.stringify(mockUsers.student)
};

// Utility functions for tests
export const createMockFetchResponse = (data: any, ok = true) => ({
  ok,
  json: () => Promise.resolve(data),
  text: () => Promise.resolve(JSON.stringify(data)),
  status: ok ? 200 : 500,
  statusText: ok ? 'OK' : 'Internal Server Error'
});

// Test wrapper components can be added later when Jest is fully configured

// Common test selectors
export const testSelectors = {
  header: {
    logo: 'EduFix',
    studentTitle: 'Student Dashboard',
    teacherTitle: 'Teacher Dashboard',
    managerTitle: 'Management Dashboard',
    userMenu: (name: string) => `button:has-text("${name}")`,
    logoutButton: 'Logout'
  },
  footer: {
    copyright: /© 2026 EduFix/,
    studentNav: ['Home', 'Lessons', 'Exercises', 'Analytics'],
    teacherNav: ['Home', 'Lessons', 'Practice', 'Dashboard'],
    managerNav: ['Home', 'Teachers', 'Classes', 'Manage']
  },
  loading: {
    spinner: 'animate-spin',
    message: /Loading/
  },
  error: {
    message: /Error|Failed/,
    retryButton: /Try Again|Retry/
  }
};
