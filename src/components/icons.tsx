export const SearchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

export const AllNotesIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M3 4h10M3 7.5h10M3 11h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

export const StarIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill={filled ? 'currentColor' : 'none'}>
    <path d="M8 2l1.8 3.6 4 .58-2.9 2.82.68 3.98L8 11.1l-3.58 1.88.68-3.98L2.2 6.18l4-.58z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
  </svg>
)

export const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M8 5v3.5l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

export const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M3 4h10M6 4V3h4v1M5.5 4l.5 8h4l.5-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const FolderIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M2 5h12v7.5a1 1 0 01-1 1H3a1 1 0 01-1-1V5zM2 5V4a1 1 0 011-1h3l1.5 2H2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
  </svg>
)

export const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M8 4v8M4 8h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

export const FilterIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <path d="M2 4h12M4.5 8h7M7 12h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
)

export const LinkIcon = () => (
  <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
    <path d="M7 9a3.2 3.2 0 004.5 0l2-2a3.2 3.2 0 00-4.5-4.5L7.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 7a3.2 3.2 0 00-4.5 0l-2 2a3.2 3.2 0 004.5 4.5L8.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

export const SettingsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M13 3l-1.41 1.41M4.46 11.54 3.05 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

export const SidebarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="1" width="4" height="12" rx="1" fill="currentColor" opacity=".9"/>
    <rect x="7" y="1" width="6" height="12" rx="1" fill="currentColor" opacity=".3"/>
  </svg>
)

export const ListIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="2" width="12" height="1.5" rx=".75" fill="currentColor"/>
    <rect x="1" y="5.5" width="12" height="1.5" rx=".75" fill="currentColor" opacity=".6"/>
    <rect x="1" y="9" width="8" height="1.5" rx=".75" fill="currentColor" opacity=".35"/>
  </svg>
)

export const PanelIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="1" width="6" height="12" rx="1" fill="currentColor" opacity=".3"/>
    <rect x="9" y="1" width="4" height="12" rx="1" fill="currentColor" opacity=".9"/>
  </svg>
)
