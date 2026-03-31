import { useState, useRef, useEffect } from 'react';
import { EllipsisVertical, Sun, Moon, Download, Upload } from 'lucide-react';

export default function HeaderMenu({ isDark, toggleTheme, exportData, importData }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const fileRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [open]);

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data.amounts && !data.goals) {
          alert('Invalid backup file.');
          return;
        }
        importData(data);
      } catch {
        alert('Could not read file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const items = [
    {
      label: isDark ? 'Light mode' : 'Dark mode',
      icon: isDark ? Sun : Moon,
      onClick: () => { toggleTheme(); setOpen(false); },
    },
    {
      label: 'Export data',
      icon: Download,
      onClick: () => { exportData(); setOpen(false); },
    },
    {
      label: 'Import data',
      icon: Upload,
      onClick: () => { fileRef.current?.click(); setOpen(false); },
    },
  ];

  return (
    <div className="relative sm:hidden" ref={menuRef}>
      <button
        onClick={() => setOpen(o => !o)}
        className="p-2 rounded-xl bg-[var(--c-card)] border border-[var(--c-border)] text-[var(--c-t3)] hover:text-[var(--c-t1)] transition-all"
        aria-label="More options"
        aria-expanded={open}
      >
        <EllipsisVertical size={14} strokeWidth={2.5} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-40 rounded-xl bg-[var(--c-select)] border border-[var(--c-border)] shadow-lg overflow-hidden z-50">
          {items.map(item => (
            <button
              key={item.label}
              onClick={item.onClick}
              className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-[12px] font-semibold text-[var(--c-t2)] hover:bg-[var(--c-card-h)] transition-colors text-left"
            >
              <item.icon size={14} strokeWidth={2.5} className="text-[var(--c-t3)]" />
              {item.label}
            </button>
          ))}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
}
