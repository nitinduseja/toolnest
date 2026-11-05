import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number;
  'aria-hidden'?: boolean;
}

/**
 * Standardized Toolnest Brand Mark.
 * Exact 4-quadrant rounded geometry matching public/favicon.svg.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = 'w-7 h-7',
  size,
  'aria-hidden': ariaHidden = true,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      width={size}
      height={size}
      className={className}
      aria-hidden={ariaHidden}
    >
      <rect width="32" height="32" rx="8" fill="#181A22" />
      <rect x="6" y="6" width="9" height="9" rx="2.5" fill="#635BFF" />
      <rect x="17" y="6" width="9" height="9" rx="2.5" fill="#635BFF" fillOpacity="0.6" />
      <rect x="6" y="17" width="9" height="9" rx="2.5" fill="#635BFF" fillOpacity="0.4" />
      <rect x="17" y="17" width="9" height="9" rx="2.5" fill="#10B981" />
    </svg>
  );
};
