const PATHS = {
  tb: (
    <>
      <path d="M12 3v7m0 0l3 3m-3-3l-3 3M5 21h14a2 2 0 002-2v-1H3v1a2 2 0 002 2z" />
      <path d="M4 18l3.5-8h9L20 18" />
    </>
  ),
  bike: (
    <>
      <circle cx="6" cy="17" r="3.2" />
      <circle cx="18" cy="17" r="3.2" />
      <path d="M6 17l4-9h3l3 5h3M10 8l2 3" />
    </>
  ),
  heart: <path d="M12 21s-7-4.35-9.5-8.5C1 9 2.5 5.5 6 5c2-.3 3.5 1 4 2 .5-1 2-2.3 4-2 3.5.5 5 4 3.5 7.5C19 16.65 12 21 12 21z" />,
  book: (
    <>
      <path d="M4 19V6a2 2 0 012-2h12a1 1 0 011 1v14" />
      <path d="M4 19a2 2 0 002 2h13" />
      <path d="M8 7h8M8 11h6" />
    </>
  ),
  health: (
    <>
      <path d="M12 2v6M9 5h6" />
      <rect x="5" y="8" width="14" height="13" rx="2" />
      <path d="M9 13h6M9 17h6" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="12" height="12" rx="1.5" />
      <path d="M5 15V5a2 2 0 012-2h10" />
    </>
  ),
  check: <path d="M20 6L9 17l-5-5" />,
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
}

export default function Icon({ name, size = 24, className, strokeWidth = 1.6 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  )
}
