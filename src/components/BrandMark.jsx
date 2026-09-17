function BrandMark({ className = '' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect x="2" y="2" width="60" height="60" rx="18" fill="currentColor" opacity="0.12" />
      <path
        d="M17 18.5c0-1.1.9-2 2-2h9.5c5.9 0 10.4 2.8 10.4 8.3 0 3.1-1.3 5.2-4 6.7 3.3 1.3 5.2 3.8 5.2 7.5 0 6.1-4.8 9.8-12 9.8H19c-1.1 0-2-.9-2-2V18.5Zm10.2 9.3h4.5c2.8 0 4.3-1.3 4.3-3.6 0-2.3-1.6-3.5-4.5-3.5h-4.3v7.1Zm0 9.4h5.1c3.3 0 5.2-1.5 5.2-4.2 0-2.8-1.8-4.3-5.2-4.3h-5.1v8.5Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default BrandMark
