import React from 'react';

interface IconProps {
    className?: string;
}

export const LiahonaBooksLogo: React.FC<IconProps> = ({ className }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 170"
      className={className}
      aria-label="Liahona Books Logo"
    >
        <g fill="currentColor" fontFamily="Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" fontWeight="900">
            <text x="100" y="80" fontSize="80" aria-label="Liahona">LIAHONA</text>
            <text x="150" y="160" fontSize="80" aria-label="Books">Books</text>
            <g transform="translate(70 120) scale(1.2)" aria-label="Compass Rose">
                <circle cx="0" cy="0" r="32" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M0 -28 L 5 -5 L 0 -8 L -5 -5 Z" />
                <path d="M0 -28 L 5 -5 L 0 -8 L -5 -5 Z" transform="rotate(45)" />
                <path d="M0 -28 L 5 -5 L 0 -8 L -5 -5 Z" transform="rotate(90)" />
                <path d="M0 -28 L 5 -5 L 0 -8 L -5 -5 Z" transform="rotate(135)" />
                <path d="M0 -28 L 5 -5 L 0 -8 L -5 -5 Z" transform="rotate(180)" />
                <path d="M0 -28 L 5 -5 L 0 -8 L -5 -5 Z" transform="rotate(225)" />
                <path d="M0 -28 L 5 -5 L 0 -8 L -5 -5 Z" transform="rotate(270)" />
                <path d="M0 -28 L 5 -5 L 0 -8 L -5 -5 Z" transform="rotate(315)" />
                <circle cx="0" cy="0" r="5" fill="currentColor"/>
                <text x="0" y="-35" textAnchor="middle" fontSize="10" fontWeight="bold">N</text>
                <text x="38" y="4" textAnchor="middle" fontSize="10" fontWeight="bold">E</text>
                <text x="0" y="42" textAnchor="middle" fontSize="10" fontWeight="bold">S</text>
                <text x="-38" y="4" textAnchor="middle" fontSize="10" fontWeight="bold">W</text>
            </g>
        </g>
    </svg>
);


export const BotIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
    </svg>
);

export const UserIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

export const SendIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

export const PrintIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
    </svg>
);

export const CopyIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export const RestartIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);
