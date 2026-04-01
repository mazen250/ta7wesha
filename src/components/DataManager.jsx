import { useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import { useLang } from '../hooks/useLang';

export default function DataManager({ exportData, importData }) {
  const fileRef = useRef(null);
  const { t } = useLang();

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data.amounts && !data.goals) {
          alert(t('invalidFile'));
          return;
        }
        importData(data);
      } catch {
        alert(t('cantReadFile'));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <>
      <button
        onClick={exportData}
        className="p-2 rounded-xl bg-[var(--c-card)] border border-[var(--c-border)] text-[var(--c-t3)] hover:text-[var(--c-t1)] transition-all"
        aria-label={t('exportData')}
        title={t('exportData')}
      >
        <Download size={14} strokeWidth={2.5} />
      </button>
      <button
        onClick={() => fileRef.current?.click()}
        className="p-2 rounded-xl bg-[var(--c-card)] border border-[var(--c-border)] text-[var(--c-t3)] hover:text-[var(--c-t1)] transition-all"
        aria-label={t('importData')}
        title={t('importData')}
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
