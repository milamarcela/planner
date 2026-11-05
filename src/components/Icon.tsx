export type IconName =
  | "flower"
  | "calendar"
  | "clock"
  | "book"
  | "users"
  | "music"
  | "sun"
  | "moon"
  | "plus"
  | "pencil"
  | "trash"
  | "x"
  | "search"
  | "play"
  | "pause"
  | "reset"
  | "sparkle"
  | "heart"
  | "key"
  | "logout"
  | "ribbon"
  | "check";

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const PATHS: Record<IconName, React.ReactNode> = {
  flower: (
    <>
      <circle cx="12" cy="12" r="3.2" fill="currentColor" stroke="none" />
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx="12"
          cy="6.4"
          rx="2.6"
          ry="4"
          transform={`rotate(${a} 12 12)`}
          fill="currentColor"
          opacity="0.55"
          stroke="none"
        />
      ))}
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
      <circle cx="8.5" cy="13.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="13.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="13.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
      <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20" />
      <path d="M8 7.5h8M8 11h5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3.5 19.5c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" />
      <circle cx="16.8" cy="9.5" r="2.6" />
      <path d="M16.5 14.6c2.2.3 3.7 1.9 4.2 4.4" />
    </>
  ),
  music: (
    <>
      <path d="M9 18.5V6l10-2v12.5" />
      <circle cx="6.8" cy="18.5" r="2.4" />
      <circle cx="16.8" cy="16.5" r="2.4" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.2 5.2l1.7 1.7M17.1 17.1l1.7 1.7M18.8 5.2l-1.7 1.7M6.9 17.1l-1.7 1.7" />
    </>
  ),
  moon: (
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z" />
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  pencil: (
    <>
      <path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19z" />
      <path d="M14.5 6.5l3 3" />
    </>
  ),
  trash: (
    <>
      <path d="M4.5 6.5h15M9.5 6V4.5h5V6M6.5 6.5l.8 13h9.4l.8-13" />
      <path d="M10 10.5v6M14 10.5v6" />
    </>
  ),
  x: <path d="M6 6l12 12M18 6L6 18" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </>
  ),
  play: <path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none" />,
  pause: (
    <>
      <rect x="6.5" y="5" width="3.6" height="14" rx="1.4" fill="currentColor" stroke="none" />
      <rect x="13.9" y="5" width="3.6" height="14" rx="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  reset: (
    <>
      <path d="M4.5 8a8 8 0 1 1-1 6" />
      <path d="M4 4v4.5h4.5" />
    </>
  ),
  sparkle: (
    <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z" fill="currentColor" stroke="none" />
  ),
  heart: (
    <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 3c0 5.4-7.5 10-7.5 10z" />
  ),
  key: (
    <>
      <circle cx="8" cy="14" r="4" />
      <path d="M11 11l8.5-8.5M16 6l3 3M13.5 8.5l2.5 2.5" />
    </>
  ),
  logout: (
    <>
      <path d="M14 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7" />
      <path d="M10 12h10M17 8.5L20.5 12 17 15.5" />
    </>
  ),
  ribbon: (
    <>
      <circle cx="12" cy="9" r="5" />
      <path d="M9.5 13.2L8 21l4-2.4L16 21l-1.5-7.8" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
};

export default function Icon({ name, size = 20, color, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color ?? "currentColor"}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0, verticalAlign: "middle" }}
    >
      {PATHS[name]}
    </svg>
  );
}
