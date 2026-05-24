interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'mark';
}

const sizes = {
  sm: { width: 110, height: 32 },
  md: { width: 165, height: 48 },
  lg: { width: 220, height: 64 },
};

export default function Logo({ size = 'md', variant = 'full' }: LogoProps) {
  const { width, height } = sizes[size];

  if (variant === 'mark') {
    const scale = height / 64;
    return (
      <svg
        width={Math.round(64 * scale)}
        height={height}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 8H40C52 8 60 16 60 28C60 40 52 48 40 48H28V56H12V8Z" fill="#19C37D" />
        <path d="M12 8H28L12 24V8Z" fill="#A7F3D0" />
        <rect x="24" y="22" width="18" height="4" rx="2" fill="white" />
        <rect x="24" y="32" width="12" height="4" rx="2" fill="white" />
      </svg>
    );
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 220 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          d="M12 8H40C52 8 60 16 60 28C60 40 52 48 40 48H28V56H12V8Z"
          fill="#19C37D"
        />
        <path d="M12 8H28L12 24V8Z" fill="#A7F3D0" />
        <rect x="24" y="22" width="18" height="4" rx="2" fill="white" />
        <rect x="24" y="32" width="12" height="4" rx="2" fill="white" />
      </g>
      <text
        x="78"
        y="42"
        fill="#0F172A"
        fontFamily="DM Sans, Inter, Helvetica, Arial, sans-serif"
        fontSize="34"
        fontWeight="600"
        letterSpacing="-1"
      >
        PayMint
      </text>
    </svg>
  );
}
