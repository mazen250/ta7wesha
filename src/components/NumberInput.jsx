import { useRef, useCallback } from 'react';

function formatDisplay(value) {
  if (value === '' || value == null) return '';
  const str = String(value);
  const dotIndex = str.indexOf('.');
  if (dotIndex !== -1) {
    const intPart = str.slice(0, dotIndex);
    const decPart = str.slice(dotIndex);
    const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return formatted + decPart;
  }
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function stripFormatting(str) {
  return str.replace(/,/g, '');
}

// Count how many raw (non-comma) characters appear before cursor position
function rawOffset(formatted, cursorPos) {
  let count = 0;
  for (let i = 0; i < cursorPos && i < formatted.length; i++) {
    if (formatted[i] !== ',') count++;
  }
  return count;
}

// Find cursor position in new formatted string that matches the raw offset
function formattedOffset(formatted, raw) {
  let count = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (formatted[i] !== ',') count++;
    if (count === raw) return i + 1;
  }
  return formatted.length;
}

export default function NumberInput({ value, onChange, className = '', ...props }) {
  const inputRef = useRef(null);

  const handleChange = useCallback((e) => {
    const el = e.target;
    const cursorPos = el.selectionStart;
    const oldFormatted = el.value;

    const raw = stripFormatting(oldFormatted);
    if (raw !== '' && !/^-?\d*\.?\d*$/.test(raw)) return;

    // figure out where the cursor should land after reformatting
    const rawCursor = rawOffset(oldFormatted, cursorPos);
    const newFormatted = formatDisplay(raw);
    const newCursor = formattedOffset(newFormatted, rawCursor);

    onChange(raw);

    // restore cursor after React re-renders the input
    requestAnimationFrame(() => {
      if (el === document.activeElement) {
        el.setSelectionRange(newCursor, newCursor);
      }
    });
  }, [onChange]);

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="decimal"
      {...props}
      value={formatDisplay(value)}
      onChange={handleChange}
      className={className}
    />
  );
}
