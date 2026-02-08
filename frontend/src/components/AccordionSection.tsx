import { useState, type ReactNode } from 'react';

interface AccordionSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function AccordionSection({ title, defaultOpen = true, children }: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex justify-between items-center text-left hover:text-gray-600 transition-colors"
      >
        <span className="font-medium text-gray-800">{title}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-6 space-y-5">
          {children}
        </div>
      )}
    </div>
  );
}
