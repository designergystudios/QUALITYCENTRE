import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCms } from '../context/CmsContext';
import { LIVE_SUPABASE_LOGO_URL } from '../lib/supabase';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  iconOnly?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  showText = true,
  size = 'md',
  iconOnly = false,
}) => {
  const { isDark } = useTheme();
  const { companyConfig } = useCms();

  const heights = {
    sm: 'h-14',
    md: 'h-20',
    lg: 'h-24 md:h-28',
    xl: 'h-36',
  };

  const [imgError, setImgError] = React.useState(false);

  // Active logo source: prefer live Supabase database URL over stale relative paths
  let activeLogoSrc = companyConfig.logoUrl;
  if (!activeLogoSrc || activeLogoSrc.startsWith('/uploads/')) {
    activeLogoSrc = LIVE_SUPABASE_LOGO_URL;
  }

  // Reset imgError if logo source changes
  React.useEffect(() => {
    setImgError(false);
  }, [activeLogoSrc]);

  // If custom uploaded logo is configured and successfully loads from live database
  if (activeLogoSrc && !imgError) {
    return (
      <div className={`inline-flex items-center select-none ${heights[size]} ${className}`}>
        <img
          src={activeLogoSrc}
          alt={companyConfig.name || 'Quality Centre Logo'}
          className="h-full w-auto max-h-full object-contain"
          referrerPolicy="no-referrer"
          onError={() => {
            if (activeLogoSrc !== LIVE_SUPABASE_LOGO_URL) {
              // Try the live Supabase storage URL before giving up
              activeLogoSrc = LIVE_SUPABASE_LOGO_URL;
            } else {
              setImgError(true);
            }
          }}
        />
      </div>
    );
  }

  // Signature Quality Centre brand cyan/blue from the logo
  const qcBlue = '#00A9CF';
  // Logo text grey: slate-grey in light mode, clean silver in dark mode
  const textGrey = isDark ? '#E2E8F0' : '#4A5568';

  if (iconOnly || !showText) {
    return (
      <div className={`inline-flex items-center select-none ${heights[size]} ${className}`}>
        <svg
          viewBox="0 0 60 60"
          className="h-full w-auto"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top circle of Q */}
          <circle
            cx="30"
            cy="22"
            r="14"
            stroke={qcBlue}
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Lower loop of Q */}
          <path
            d="M 36 29 C 40 34 38 46 29 46 C 21 46 18 36 24 30 C 26 28 29 27 30 27"
            stroke={qcBlue}
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Swoosh tail */}
          <path
            d="M 28 46 C 35 46 44 42 54 44"
            stroke={qcBlue}
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center select-none ${heights[size]} ${className}`}>
      <svg
        viewBox="0 0 240 68"
        className="h-full w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* =======================
            THE QUALITY CENTRE "Q"
            Upper loop and lower swoosh loop
            ======================= */}
        {/* Upper bowl of Q */}
        <circle
          cx="28"
          cy="22"
          r="15"
          stroke={qcBlue}
          strokeWidth="4.2"
          strokeLinecap="round"
        />

        {/* Lower loop of Q that links to the under-swoosh */}
        <path
          d="M 36 29 C 40 33 39 46 29 47 C 19 47 16 34 23 28 C 25 25 28 24 30 24"
          stroke={qcBlue}
          strokeWidth="4.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* =======================
            THE UNDER-SWOOSH RIBBON
            Flows from bottom of Q, waves gracefully beneath "ualit",
            and rises up to form the stem of the "y"!
            ======================= */}
        <path
          d="M 29 47 C 38 46 54 40 85 41 C 115 42 135 48 152 48 C 165 48 178 41 183 33 L 183 23"
          stroke={qcBlue}
          strokeWidth="3.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* The left diagonal arm of the "y" in Quality */}
        <path
          d="M 172 23 L 179 36"
          stroke={qcBlue}
          strokeWidth="3.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* The right arm & stem of the "y" in Quality (connected to the wave) */}
        <path
          d="M 189 23 L 180 38"
          stroke={qcBlue}
          strokeWidth="3.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* =======================
            "ualit" TEXT
            Clean slate-grey typography positioned above the swoosh
            ======================= */}
        <text
          x="48"
          y="32"
          fill={textGrey}
          fontFamily="system-ui, -apple-system, 'Plus Jakarta Sans', sans-serif"
          fontSize="25"
          fontWeight="600"
          letterSpacing="-0.3px"
        >
          ualit
        </text>

        {/* =======================
            "Centre" TEXT
            Clean slate-grey typography positioned below the swoosh
            ======================= */}
        <text
          x="54"
          y="62"
          fill={textGrey}
          fontFamily="system-ui, -apple-system, 'Plus Jakarta Sans', sans-serif"
          fontSize="26"
          fontWeight="600"
          letterSpacing="-0.2px"
        >
          Centre
        </text>
      </svg>
    </div>
  );
};

