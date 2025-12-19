'use client';

import { useState } from 'react';

export default function SearchBar({ onSearch, placeholder = 'Search users...' }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="p-4 border-b border-gray-200 bg-white">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
      </div>
    </div>
  );
}

