import { PieChart } from 'lucide-react';
import { formatNumber } from '../utils/format';

const RADIUS = 60;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function NetWorthChart({ breakdown }) {
  if (!breakdown || breakdown.length === 0) return null;

  let cumulativeOffset = 0;

  return (
    <div className="rounded-2xl bg-[var(--c-card)] border border-[var(--c-border)] p-5" role="region" aria-label="Net worth breakdown">
      <h2 className="text-base font-bold mb-4 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-pink-500/15 flex items-center justify-center" aria-hidden="true">
          <PieChart size={16} className="text-pink-400" strokeWidth={2.5} />
        </div>
        Net Worth Breakdown
      </h2>

      <div className="flex items-center gap-6">
        {/* Donut chart */}
        <svg
          width="140" height="140" viewBox="0 0 140 140"
          className="shrink-0"
          role="img"
          aria-label={`Asset allocation: ${breakdown.map(s => `${s.label} ${s.pct.toFixed(1)}%`).join(', ')}`}
        >
          {breakdown.map(segment => {
            const segmentLength = (segment.pct / 100) * CIRCUMFERENCE;
            const offset = -cumulativeOffset;
            cumulativeOffset += segmentLength;
            return (
              <circle
                key={segment.key}
                cx="70" cy="70" r={RADIUS}
                fill="none"
                stroke={segment.color}
                strokeWidth="16"
                strokeDasharray={`${segmentLength} ${CIRCUMFERENCE - segmentLength}`}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 70 70)"
                className="transition-all duration-700"
              />
            );
          })}
          <text x="70" y="66" textAnchor="middle" className="fill-[var(--c-t1)] text-xs font-bold">
            {breakdown.length}
          </text>
          <text x="70" y="80" textAnchor="middle" className="fill-[var(--c-t3)] text-[10px] font-medium">
            assets
          </text>
        </svg>

        {/* Legend */}
        <div className="flex-1 space-y-2.5">
          {breakdown.map(segment => (
            <div key={segment.key} className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: segment.color }} aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--c-t2)]">{segment.label}</span>
                  <span className="text-xs font-bold">{segment.pct.toFixed(1)}%</span>
                </div>
                <p className="text-[10px] font-medium text-[var(--c-t3)]">EGP {formatNumber(segment.value)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
