import { useId } from 'react';

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

  const displayValue = () => {
    switch (format) {
      case 'currency':
        return `$${value.toLocaleString()}`;
      case 'percent':
        return `${(value * 100).toFixed(1)}%`;
      case 'years':
        return `${value} ${value === 1 ? 'year' : 'years'}`;
      case 'months':
        return `${value} ${value === 1 ? 'month' : 'months'}`;
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.-]/g, '');
    let num = parseFloat(raw);
    if (isNaN(num)) return;

    if (format === 'percent') {
      num = num / 100;
    }

    num = Math.max(min, Math.min(max, num));
    onChange(num);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-sm text-gray-600">
          {label}
        </label>
        <input
          type="text"
          value={displayValue()}
          onChange={handleTextChange}
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
