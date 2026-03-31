import { useRef } from 'react';
import { Download, Upload } from 'lucide-react';

export default function DataManager({ exportData, importData }) {
  const fileRef = useRef(null);

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
    // Reset so the same file can be re-imported
    e.target.value = '';
  };

  return (
    <>
      <button
        onClick={exportData}
        className="p-2 rounded-xl bg-[var(--c-card)] border border-[var(--c-border)] text-[var(--c-t3)] hover:text-[var(--c-t1)] transition-all"
        aria-label="Export data"
        title="Export data"
      >
        <Download size={14} strokeWidth={2.5} />
      </button>
      <button
        onClick={() => fileRef.current?.click()}
        className="p-2 rounded-xl bg-[var(--c-card)] border border-[var(--c-border)] text-[var(--c-t3)] hover:text-[var(--c-t1)] transition-all"
        aria-label="Import data"
        title="Import data"
      >
        <Upload size={14} strokeWidth={2.5} />
      </button>
      <input
        ref={fileRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
        aria-hidden="true"
      />
    </>
  );
}
