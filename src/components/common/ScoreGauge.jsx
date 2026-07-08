import { useEffect, useState } from 'react';
import { MAX_SCORE } from '../../utils/constants.js';

/**
 * The site's signature visual motif: admission to these schools hinges on a
 * single number (the Thanaweya Amma minimum score out of 410), so we render
 * it as a certificate-style seal with a progress ring instead of a plain
 * badge or number. Used on cards, details page, and compare table.
 */
export default function ScoreGauge({ score, size = 64, label }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const pct = score ? Math.min(Math.max(score / MAX_SCORE, 0), 1) : 0;
  const offset = circumference - pct * circumference;

  return (
    <div
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={label || `${score ?? '—'} / ${MAX_SCORE}`}
    >
      <svg viewBox="0 0 64 64" width={size} height={size} className="-rotate-90">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="#EFE9DA" strokeWidth="5" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="#C69A3C"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={mounted ? offset : circumference}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-[0.85em] font-bold leading-none text-ink-900">
          {score ?? '—'}
        </span>
      </div>
    </div>
  );
}
