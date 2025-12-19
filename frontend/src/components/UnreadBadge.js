'use client';

export default function UnreadBadge({ count }) {
  if (!count || count === 0) return null;

  return (
    <span className="absolute top-1 right-1 bg-primary-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 animate-scale-in shadow-lg">
      {count > 99 ? '99+' : count}
    </span>
  );
}

