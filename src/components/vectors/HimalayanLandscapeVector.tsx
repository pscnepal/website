import type { FC } from 'react';

interface HimalayanLandscapeVectorProps {
  className?: string;
  variant?: 'subtle' | 'vibrant';
}

export const HimalayanLandscapeVector: FC<HimalayanLandscapeVectorProps> = ({
  className = '',
  variant = 'subtle',
}) => {
  const isVibrant = variant === 'vibrant';

  return (
    <svg
      viewBox="0 0 1200 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-auto select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="himalaya-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop
            offset="0%"
            stopColor="currentColor"
            stopOpacity={isVibrant ? '0.18' : '0.07'}
          />
          <stop
            offset="100%"
            stopColor="currentColor"
            stopOpacity={isVibrant ? '0.03' : '0.01'}
          />
        </linearGradient>
        <linearGradient id="himalaya-gradient-2" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop
            offset="0%"
            stopColor="currentColor"
            stopOpacity={isVibrant ? '0.28' : '0.12'}
          />
          <stop
            offset="100%"
            stopColor="currentColor"
            stopOpacity={isVibrant ? '0.06' : '0.02'}
          />
        </linearGradient>
        <linearGradient id="himalaya-sun-glow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#DC2626" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Atmospheric Dawn Sun Arc */}
      <circle cx="600" cy="180" r="140" fill="url(#himalaya-sun-glow)" />

      {/* Far Snow Peak Mountain Range (Everest / Lhotse / Annapurna Massif outline) */}
      <path
        d="M0 240 L80 180 L160 210 L240 140 L310 175 L380 110 L450 160 L520 85 L600 40 L680 90 L750 135 L830 75 L910 130 L990 95 L1060 160 L1130 145 L1200 210 L1200 320 L0 320 Z"
        fill="url(#himalaya-gradient-1)"
      />

      {/* Mid Peak Ridgeline with Sharp Crags */}
      <path
        d="M0 270 L95 210 L175 235 L260 170 L340 205 L420 145 L490 190 L560 120 L620 95 L690 140 L760 185 L840 130 L920 175 L1010 140 L1090 200 L1155 180 L1200 240 L1200 320 L0 320 Z"
        fill="url(#himalaya-gradient-2)"
      />

      {/* Foreground Foothill Topographic Contour Waves */}
      <path
        d="M0 295 Q300 240 600 280 T1200 270 L1200 320 L0 320 Z"
        fill="currentColor"
        fillOpacity={isVibrant ? '0.06' : '0.025'}
      />

      {/* Subtle Contour Hairlines */}
      <path
        d="M20 235 Q320 160 600 200 T1180 205"
        stroke="currentColor"
        strokeOpacity={isVibrant ? '0.2' : '0.08'}
        strokeWidth="1"
        strokeDasharray="4 6"
      />
      <path
        d="M0 275 Q280 215 620 245 T1200 250"
        stroke="currentColor"
        strokeOpacity={isVibrant ? '0.25' : '0.1'}
        strokeWidth="1"
      />
    </svg>
  );
};
