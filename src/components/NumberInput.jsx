import { useState, useCallback } from 'react';

function formatDisplay(value) {
  if (value === '' || value == null) return '';
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  // Preserve decimal part as-is while typing
  const str = String(value);
  const dotIndex = str.indexOf('.');
  if (dotIndex !== -1) {
    const intPart = str.slice(0, dotIndex);
    const decPart = str.slice(dotIndex);
    const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return formatted + decPart;
  }
  return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function stripFormatting(str) {
  return str.replace(/,/g, '');
}

export default function NumberInput({ value, onChange, className = '', ...props }) {
  const [focused, setFocused] = useState(false);

  const handleChange = useCallback((e) => {
    const raw = stripFormatting(e.target.value);
    // Allow empty, digits, single dot, and leading minus
    if (raw === '' || /^-?\d*\.?\d*$/.test(raw)) {
      onChange(raw);
    }
  }, [onChange]);

  const handleFocus = useCallback(() => setFocused(true), []);
  const handleBlur = useCallback(() => setFocused(false), []);

  const displayValue = focused ? (value ?? '') : formatDisplay(value);

  return (
    <input
      type="text"
      inputMode="decimal"
      {...props}
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={className}
    />
  );
}
