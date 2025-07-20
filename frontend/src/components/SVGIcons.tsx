// svgIcons.ts

// Base Icon Props
type IconProps = React.SVGProps<SVGSVGElement> & {
  variant?: 'filled' | 'outlined';
};

// Menu Icon
export const MenuIcon = (props: IconProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
    <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Add Icon
export const AddIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...props}>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Delete Icon
export const DeleteIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...props}>
    <path d="M6 7h12M9 7v12M15 7v12M4 7h16l-1 14H5L4 7zM9 4h6l1 3H8l1-3z" fill="currentColor" />
  </svg>
);

// Edit Icon
export const EditIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...props}>
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor" />
    <path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor" />
  </svg>
);

// Save Icon
export const SaveIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...props}>
    <path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14V7l-4-4zM12 19a2.5 2.5 0 1 1 .001-5.001A2.5 2.5 0 0 1 12 19zm3-10H5V5h10v4z" fill="currentColor" />
  </svg>
);

// Upload File
export const UploadFileIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM13 9V3.5L18.5 9H13zM12 17v-5l-3 3 1.41 1.41L11 14.83V17h2z" fill="currentColor" />
  </svg>
);

// Expand More / Less
export const ExpandMoreIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...props}>
    <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ExpandLessIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...props}>
    <path d="M7 14l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Copy Icon
export const ContentCopyIcon = (props: IconProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
    <path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 18H8V7h11v16z" fill="currentColor" />
  </svg>
);

// Drawer Arrows
export const DrawerExpandIcon = (props: IconProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
    <path d="M10 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const DrawerCollapseIcon = (props: IconProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
    <path d="M14 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Home Icon
export const HomeIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...props}>
    <path d="M3 12l9-9 9 9h-3v7h-4v-5H10v5H6v-7H3z" fill="currentColor" />
  </svg>
);

// Dashboard Icon
export const DashboardIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...props}>
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor" />
  </svg>
);

// Saved Routes: Map/route sheet icon
export const RouteIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M7 9h10M7 13h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="7" cy="9" r="1" fill="currentColor"/>
    <circle cx="14" cy="13" r="1" fill="currentColor"/>
  </svg>
);

// Avatar/User Icon
export const AvatarIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...props}>
    <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z" fill="currentColor" />
  </svg>
);

// Logout
export const LogoutIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...props}>
    <path d="M16 13v-2H7V8l-5 4 5 4v-3h9zm3-10H5a2 2 0 0 0-2 2v6h2V5h14v14H5v-6H3v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" fill="currentColor" />
  </svg>
);

export const RestaurantIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...props}>
    {/* Fork */}
    <path d="M8 2v8.5a1.5 1.5 0 0 1-3 0V2h1v4h1V2h1zM6 11h2v11H6V11z" fill="currentColor" />
    {/* Knife */}
    <path d="M12 2h1v20h-1c-0.5 0-1-0.5-1-1V10c0-3.5 2-6 2-8z" fill="currentColor" />
  </svg>
);

export const RequestIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...props}>
    <path
      d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" />
    <path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const RemoveCircleOutlineIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
    {/* Circle outline */}
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    {/* Horizontal minus line */}
    <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
