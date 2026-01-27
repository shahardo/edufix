// Utility functions for data formatting

/**
 * Get initials from a full name
 */
export const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

/**
 * Format relative time (e.g., "2 hours ago", "3 days ago")
 */
export const formatRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString();
};

/**
 * Format a number as a percentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Get color classes based on mastery score
 */
export const getMasteryColorClasses = (score: number) => {
  if (score >= 80) return 'bg-green-500 text-green-600';
  if (score >= 60) return 'bg-blue-500 text-blue-600';
  if (score >= 40) return 'bg-yellow-500 text-yellow-600';
  return 'bg-red-500 text-red-600';
};

/**
 * Get status color classes for student status
 */
export const getStatusColorClasses = (status: string) => {
  switch (status) {
    case 'Excellent':
    case 'Active':
      return 'bg-green-100 text-green-800';
    case 'Good':
      return 'bg-blue-100 text-blue-800';
    case 'Needs Improvement':
      return 'bg-yellow-100 text-yellow-800';
    case 'At Risk':
    case 'Inactive':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Calculate attendance rate
 */
export const calculateAttendanceRate = (activeStudents: number, totalStudents: number): number => {
  if (totalStudents === 0) return 0;
  return Math.round((activeStudents / totalStudents) * 100);
};

/**
 * Format large numbers with K/M suffixes
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};
