import React from 'react';
import { Button } from '@/components/ui/button';

export default function PillSelector({ title, description, options, selectedOptions, onSelectionChange }) {
  const handleToggle = (option) => {
    const newSelection = selectedOptions.includes(option)
      ? selectedOptions.filter(item => item !== option)
      : [...selectedOptions, option];
    onSelectionChange(newSelection);
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
      {description && <p className="text-sm text-gray-600 -mt-2 mb-4">{description}</p>}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option}
            type="button"
            variant={selectedOptions.includes(option) ? 'default' : 'outline'}
            onClick={() => handleToggle(option)}
            className={`rounded-full h-auto py-2 px-4 transition-all duration-200 text-right leading-snug ${
              selectedOptions.includes(option)
                ? 'bg-rose-500 text-white border-rose-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-rose-50 hover:border-rose-300'
            }`}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}