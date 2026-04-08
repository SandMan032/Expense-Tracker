function IconBase({ children, className = 'h-5 w-5' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function UsersIcon({ className }) {
  return (
    <IconBase className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </IconBase>
  );
}

function ReceiptIcon({ className }) {
  return (
    <IconBase className={className}>
      <path d="M4 3v18l3-2 2 2 2-2 2 2 2-2 2 2 3-2V3" />
      <path d="M8 7h8" />
      <path d="M8 11h8" />
      <path d="M8 15h5" />
    </IconBase>
  );
}

function ArrowsIcon({ className }) {
  return (
    <IconBase className={className}>
      <path d="M7 7h11v11" />
      <path d="m7 17 11-11" />
      <path d="M17 7h-6" />
      <path d="M7 17v-6" />
    </IconBase>
  );
}

function WalletIcon({ className }) {
  return (
    <IconBase className={className}>
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-8.5Z" />
      <path d="M3 9h18" />
      <path d="M16.5 14h.01" />
    </IconBase>
  );
}

function PlusIcon({ className }) {
  return (
    <IconBase className={className}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </IconBase>
  );
}

export { ArrowsIcon, PlusIcon, ReceiptIcon, UsersIcon, WalletIcon };
