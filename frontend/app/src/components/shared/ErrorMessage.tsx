import React from 'react';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  icon?: string;
  className?: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Error Loading Data',
  message = 'Unable to load data. Please try again later.',
  icon = 'fas fa-exclamation-triangle',
  className = '',
  onRetry
}) => {
  return (
    <div className={`bg-gray-50 min-h-screen flex items-center justify-center ${className}`}>
      <div className="text-center max-w-md mx-auto p-6">
        <div className="text-red-500 mb-4">
          <i className={`${icon} text-4xl`}></i>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
