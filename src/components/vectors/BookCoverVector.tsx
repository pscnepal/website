import type { FC } from 'react';

interface BookCoverVectorProps {
  title: string;
  codeOrEdition: string;
  themeColor?: 'crimson' | 'navy' | 'emerald' | 'amber';
  className?: string;
  aspectRatio?: 'standard' | 'compact';
}

export const BookCoverVector: FC<BookCoverVectorProps> = ({
  title,
  codeOrEdition,
  themeColor = 'navy',
  className = '',
  aspectRatio = 'standard',
}) => {
  // Extract edition number or year if present
  const editionMatch = codeOrEdition.match(/(\d+)(?:st|nd|rd|th)?\s*Edition/i);
  const editionNumber = editionMatch ? editionMatch[1] : '';
  const yearMatch = codeOrEdition.match(/(\d{4})\s*BS/i);
  const yearBs = yearMatch ? yearMatch[1] : '';

  // Palette schemes for authoritative administrative bindings
  const colorConfigs = {
    navy: {
      bgGradient: 'from-slate-900 via-indigo-950 to-slate-950',
      spineColor: 'bg-indigo-950/80',
      accentColor: '#F59E0B', // Amber gold
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
      sealStroke: '#FBBF24',
    },
    crimson: {
      bgGradient: 'from-rose-950 via-red-950 to-zinc-950',
      spineColor: 'bg-red-950/80',
      accentColor: '#FBBF24',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
      sealStroke: '#FBBF24',
    },
    emerald: {
      bgGradient: 'from-emerald-950 via-teal-950 to-zinc-950',
      spineColor: 'bg-emerald-950/80',
      accentColor: '#34D399',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
      sealStroke: '#34D399',
    },
    amber: {
      bgGradient: 'from-amber-950 via-stone-900 to-zinc-950',
      spineColor: 'bg-amber-950/80',
      accentColor: '#F59E0B',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
      sealStroke: '#F59E0B',
    },
  };

  const scheme = colorConfigs[themeColor];
  const isCompact = aspectRatio === 'compact';

  return (
    <div
      className={`relative rounded-lg overflow-hidden shadow-md border border-white/10 select-none group-hover:scale-[1.02] transition-transform duration-300 ${
        isCompact ? 'w-24 h-32' : 'w-28 sm:w-32 h-36 sm:h-44'
      } bg-gradient-to-br ${scheme.bgGradient} flex flex-col justify-between p-2.5 sm:p-3 shrink-0 ${className}`}
    >
      {/* 3D Book Spine Left Shadow */}
      <div className="absolute top-0 left-0 bottom-0 w-2.5 bg-gradient-to-r from-black/50 via-white/10 to-transparent border-r border-white/10" />

      {/* Decorative Gold Inset Border */}
      <div className="absolute inset-1.5 rounded border border-amber-400/25 pointer-events-none" />

      {/* Top Header: Nepal Government / Crest Seal */}
      <div className="pl-2 space-y-1 relative z-10">
        <div className="flex items-center justify-between">
          <svg
            className="w-5 h-5 text-amber-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Minimalist Emblem of Nepal Vector Outline */}
            <path d="M12 2 L19 7 L19 14 C19 18 12 22 12 22 C12 22 5 18 5 14 L5 7 Z" />
            <path d="M8 12 L12 8 L16 12" />
            <path d="M10 14 L12 12 L14 14" />
          </svg>

          {editionNumber && (
            <span
              className={`text-[9px] font-mono tabular-nums px-1.5 py-0.2 rounded border font-semibold ${scheme.badgeBg}`}
            >
              #{editionNumber}
            </span>
          )}
        </div>

        <p className="text-[8px] font-mono tracking-widest text-amber-200/80 uppercase truncate">
          नेपाल सरकार
        </p>
      </div>

      {/* Center: Book Title & Emblem */}
      <div className="pl-2 my-auto text-center relative z-10">
        <h4 className="text-[11px] sm:text-xs font-serif font-bold text-white tracking-wide leading-tight line-clamp-2 drop-shadow-sm">
          {title.includes('नेपाल परिचय') ? 'नेपाल परिचय' : title}
        </h4>
        <p className="mt-0.5 text-[8px] text-amber-300/80 font-mono tracking-tight truncate">
          {yearBs ? `वि.सं. ${yearBs}` : codeOrEdition}
        </p>
      </div>

      {/* Bottom: Official Publisher Ribbon */}
      <div className="pl-2 pt-1 border-t border-amber-400/20 flex items-center justify-between text-[7px] font-mono text-zinc-400 relative z-10">
        <span className="truncate text-amber-100/70">DoIB Compendium</span>
        <span className="text-amber-400 font-bold">PSC</span>
      </div>

      {/* Realistic Page Edge Highlight (Right Edge) */}
      <div className="absolute top-0 right-0 bottom-0 w-0.5 bg-gradient-to-l from-white/20 to-transparent" />
    </div>
  );
};
