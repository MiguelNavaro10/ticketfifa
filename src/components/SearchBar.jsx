import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <form onSubmit={handleSubmit} className="relative">
        <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar partidos por país, estadios, ciudades de la Copa del Mundo..."
          className="w-full py-4 pl-14 pr-6 rounded-full border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:border-gray-400 focus:bg-white transition-all"
        />
      </form>
    </div>
  );
}
