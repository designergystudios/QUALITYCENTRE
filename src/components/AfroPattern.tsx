import React from 'react';

interface AfroPatternProps {
  className?: string;
  variant?: 'grid' | 'diamonds' | 'chevrons' | 'circuit' | 'tribal-modern';
  opacity?: number;
}

export const AfroPattern: React.FC<AfroPatternProps> = ({
  className = '',
  variant = 'diamonds',
  opacity = 0.15,
}) => {
  if (variant === 'diamonds') {
    return (
      <svg
        className={`pointer-events-none absolute select-none ${className}`}
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity }}
      >
        <defs>
          <pattern
            id="afro-diamonds-pattern"
            x="0"
            y="0"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            {/* Outer Diamond */}
            <path
              d="M30 0 L60 30 L30 60 L0 30 Z"
              fill="none"
              stroke="#00B4D8"
              strokeWidth="0.75"
              strokeDasharray="2 2"
            />
            {/* Inner Geometric Diamond */}
            <path
              d="M30 14 L46 30 L30 46 L14 30 Z"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="0.75"
            />
            {/* Micro Node */}
            <circle cx="30" cy="30" r="1.5" fill="#38BDF8" />
            <circle cx="0" cy="30" r="1" fill="#F59E0B" />
            <circle cx="60" cy="30" r="1" fill="#F59E0B" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#afro-diamonds-pattern)" />
      </svg>
    );
  }

  if (variant === 'chevrons') {
    return (
      <svg
        className={`pointer-events-none absolute select-none ${className}`}
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity }}
      >
        <defs>
          <pattern
            id="afro-chevrons-pattern"
            x="0"
            y="0"
            width="80"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 20 L20 0 L40 20 L60 0 L80 20"
              fill="none"
              stroke="#00B4D8"
              strokeWidth="1"
            />
            <path
              d="M0 40 L20 20 L40 40 L60 20 L80 40"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="0.75"
              strokeDasharray="3 3"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#afro-chevrons-pattern)" />
      </svg>
    );
  }

  // Modern African weave circuit
  return (
    <svg
      className={`pointer-events-none absolute select-none ${className}`}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      <defs>
        <pattern
          id="afro-circuit-pattern"
          x="0"
          y="0"
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M50 0 L100 50 L50 100 L0 50 Z"
            fill="none"
            stroke="#0096C7"
            strokeWidth="0.8"
          />
          <line x1="50" y1="0" x2="50" y2="100" stroke="#F59E0B" strokeWidth="0.5" strokeDasharray="4 4" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#00B4D8" strokeWidth="0.5" strokeDasharray="4 4" />
          <rect x="47" y="47" width="6" height="6" fill="#0F172A" stroke="#38BDF8" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#afro-circuit-pattern)" />
    </svg>
  );
};
