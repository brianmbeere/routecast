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

// Produce/Farm related icons for new implementation
export const InventoryIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M9 9h6v6H9z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M3 9h18M9 3v18" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export const ProduceIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
          fill="currentColor"/>
    <circle cx="12" cy="10" r="2" fill="white"/>
  </svg>
);

export const AcceptIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export const DeclineIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export const DeliveryIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M1 3h15v13H1z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M16 8h4l3 3v5h-3m-4 0V8" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

export const AnalyticsIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2"/>
    <path d="M18 8l-4 4-2-2-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="1" fill="currentColor"/>
    <circle cx="18" cy="8" r="1" fill="currentColor"/>
    <circle cx="6" cy="16" r="1" fill="currentColor"/>
  </svg>
);

export const RefreshIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M3 3v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 21v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L3 9m18 6l-2.64 3.36A9 9 0 0 1 3.51 15" 
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const SettingsIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" 
          stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export const MoneyIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 15s1.5-2 4-2 4 2 4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const CalendarIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export const LocationIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export const WeightIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M6.5 6.5h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M6 8l1.5 8h9L18 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="5" r="2" stroke="currentColor" strokeWidth="2"/>
    <circle cx="15" cy="5" r="2" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export const OrganicIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M12 2C13.5 4 15 7 15 10a3 3 0 0 1-6 0c0-3 1.5-6 3-8z" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
    <path d="M8 10c0 0-2 2-2 5a4 4 0 0 0 8 0c0-3-2-5-2-5" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M12 17v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const SearchIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const FilterIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

export const MoreVertIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="12" cy="12" r="1" fill="currentColor"/>
    <circle cx="12" cy="5" r="1" fill="currentColor"/>
    <circle cx="12" cy="19" r="1" fill="currentColor"/>
  </svg>
);
