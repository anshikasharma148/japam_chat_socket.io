'use client';

export default function MessageStatus({ isRead, isSending }) {
  if (isSending) {
    return (
      <span className="inline-flex items-center ml-1 text-gray-400 dark:text-gray-500">
        <svg className="w-3 h-3 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="2" />
        </svg>
      </span>
    );
  }

  if (isRead) {
    // Blue double tick (read)
    return (
      <span className="inline-flex items-center ml-1 text-blue-500">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" transform="translate(0, 2)" />
        </svg>
      </span>
    );
  }

  // Grey single tick (sent)
  return (
    <span className="inline-flex items-center ml-1 text-gray-400 dark:text-gray-500">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    </span>
  );
}

