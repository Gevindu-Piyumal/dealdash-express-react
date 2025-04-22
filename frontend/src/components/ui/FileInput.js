'use client';

import { useState } from 'react';

export default function FileInput({
  id,
  label,
  onChange,
  accept = 'image/*',
  required = false,
  error = '',
  className = '',
}) {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : '');
    onChange(e);
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center">
        <label
          htmlFor={id}
          className="cursor-pointer bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm leading-4 text-gray-700 hover:bg-gray-50"
        >
          Browse files
        </label>
        <span className="ml-3 text-sm text-gray-500">
          {fileName || 'No file selected'}
        </span>
        <input
          id={id}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          required={required}
          className="sr-only" // This hides the actual file input
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}