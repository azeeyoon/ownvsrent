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
}: SliderInputProps) {
  const id = useId();

  // Local state for text input - allows free typing
  const [textValue, setTextValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

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
        <label htmlFor={id} className="text-sm text-gray-600">
          {label}
        </label>
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
