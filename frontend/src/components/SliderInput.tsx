import { useId, useState, useEffect } from 'react';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  format: 'currency' | 'percent' | 'years' | 'months';
  helpText?: string;
  tooltip?: string;
}

export function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
  helpText,
  tooltip,
}: SliderInputProps) {
  const id = useId();

  // Local state for text input - allows free typing
  const [textValue, setTextValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Format value for display
  const formatForDisplay = (val: number): string => {
    switch (format) {
      case 'currency':
        return `$${val.toLocaleString()}`;
      case 'percent':
        return `${(val * 100).toFixed(1)}%`;
      case 'years':
        return `${val}`;
      case 'months':
        return `${val}`;
    }
  };

  // Format value for editing (no symbols, just numbers)
  const formatForEditing = (val: number): string => {
    switch (format) {
      case 'currency':
        return val.toString();
      case 'percent':
        return (val * 100).toFixed(1);
      case 'years':
      case 'months':
        return val.toString();
    }
  };

  // Sync text value when external value changes (and not focused)
  useEffect(() => {
    if (!isFocused) {
      setTextValue(formatForDisplay(value));
    }
  }, [value, isFocused, format]);

  // Handle text input focus
  const handleFocus = () => {
    setIsFocused(true);
    // Show raw number for easier editing
    setTextValue(formatForEditing(value));
  };

  // Handle text input blur - validate and update
  const handleBlur = () => {
    setIsFocused(false);

    // Parse the entered value
    const raw = textValue.replace(/[^0-9.-]/g, '');
    let num = parseFloat(raw);

    if (isNaN(num)) {
      // Reset to current value if invalid
      setTextValue(formatForDisplay(value));
      return;
    }

    // Convert percent input (user types "6.8" meaning 6.8%)
    if (format === 'percent') {
      num = num / 100;
    }

    // Clamp to valid range
    num = Math.max(min, Math.min(max, num));

    // Round to step precision
    num = Math.round(num / step) * step;

    // Update parent
    onChange(num);

    // Update display
    setTextValue(formatForDisplay(num));
  };

  // Handle typing - allow free input
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(e.target.value);
  };

  // Handle Enter key - treat like blur
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <label htmlFor={id} className="text-sm text-gray-600">
            {label}
          </label>
          {tooltip && (
            <div className="relative">
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip(!showTooltip)}
                aria-label={`Info about ${label}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              {showTooltip && (
                <div className="absolute left-0 bottom-full mb-2 z-50 w-64 p-3 text-xs text-gray-700 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="font-medium text-gray-900 mb-1">{label}</div>
                  <p className="leading-relaxed">{tooltip}</p>
                  <div className="absolute left-3 bottom-0 transform translate-y-1/2 rotate-45 w-2 h-2 bg-white border-r border-b border-gray-200"></div>
                </div>
              )}
            </div>
          )}
        </div>
        <input
          type="text"
          value={textValue}
          onChange={handleTextChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-24 text-right bg-gray-50 border border-gray-200 rounded-md px-2 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
        />
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
      {helpText && (
        <p className="text-xs text-gray-400">{helpText}</p>
      )}
    </div>
  );
}
