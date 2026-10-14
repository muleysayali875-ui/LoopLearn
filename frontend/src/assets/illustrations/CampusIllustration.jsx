import React from 'react';

export const CampusIllustration = () => {
  return (
    <svg
      viewBox="0 0 460 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: '420px', height: 'auto' }}
      aria-label="Student books, notebook, plant, and campus study supplies illustration"
      role="img"
    >
      <defs>
        <filter id="subtleShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#242A24" floodOpacity="0.08" />
        </filter>
      </defs>

      {/* Decorative Warm Background Circles */}
      <circle cx="230" cy="190" r="150" fill="#DCE8D9" fillOpacity="0.45" />
      <circle cx="280" cy="140" r="70" fill="#F3C9A5" fillOpacity="0.3" />

      {/* Surface Base Line */}
      <path
        d="M50 330H410"
        stroke="#E7E3DA"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Stack of Books */}
      <g filter="url(#subtleShadow)">
        {/* Bottom Book (Deep Forest Green) */}
        <rect x="90" y="285" width="220" height="38" rx="5" fill="#285C46" />
        <rect x="94" y="290" width="210" height="4" rx="2" fill="#1e4635" />
        <path d="M300 285H310V323H300C298 323 298 285 300 285Z" fill="#F8F6F0" />
        {/* Spine Title Lines */}
        <line x1="120" y1="304" x2="250" y2="304" stroke="#DCE8D9" strokeWidth="2" strokeLinecap="round" />

        {/* Middle Book (Warm Apricot) */}
        <rect x="110" y="247" width="180" height="36" rx="5" fill="#F3C9A5" />
        <rect x="114" y="252" width="170" height="3" rx="1.5" fill="#e0b187" />
        <path d="M280 247H290V283H280C278 283 278 247 280 247Z" fill="#F8F6F0" />
        <line x1="135" y1="265" x2="240" y2="265" stroke="#8A4E1B" strokeWidth="2" strokeLinecap="round" />

        {/* Top Book (Muted Sage) */}
        <rect x="125" y="213" width="150" height="32" rx="4" fill="#DCE8D9" />
        <path d="M265 213H275V245H265C263 245 263 213 265 213Z" fill="#F8F6F0" />
        <line x1="145" y1="229" x2="225" y2="229" stroke="#37533B" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Open Notebook Standing Slightly */}
      <g filter="url(#subtleShadow)">
        {/* Left page */}
        <path
          d="M140 135C155 138 185 142 195 146V208C185 204 155 200 140 197Z"
          fill="#FFFEFA"
          stroke="#E7E3DA"
          strokeWidth="1.5"
        />
        {/* Right page */}
        <path
          d="M250 135C235 138 205 142 195 146V208C205 204 235 200 250 197Z"
          fill="#FFFEFA"
          stroke="#E7E3DA"
          strokeWidth="1.5"
        />
        {/* Notebook binding */}
        <line x1="195" y1="146" x2="195" y2="208" stroke="#285C46" strokeWidth="2.5" />
        {/* Text lines on pages */}
        <line x1="150" y1="154" x2="185" y2="159" stroke="#E7E3DA" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="150" y1="166" x2="185" y2="171" stroke="#E7E3DA" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="150" y1="178" x2="180" y2="183" stroke="#E7E3DA" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="205" y1="159" x2="240" y2="154" stroke="#E7E3DA" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="205" y1="171" x2="240" y2="166" stroke="#E7E3DA" strokeWidth="1.5" strokeLinecap="round" />
        {/* Ribbon Bookmark */}
        <path d="M195 208L190 230L195 224L200 230L195 208Z" fill="#8A4E1B" />
      </g>

      {/* Potted Plant with Leaves on the Right */}
      <g filter="url(#subtleShadow)">
        {/* Plant Pot */}
        <path d="M330 260L338 325H376L384 260H330Z" fill="#F3C9A5" />
        <rect x="326" y="254" width="62" height="10" rx="3" fill="#e0b187" />

        {/* Plant Leaves */}
        <path
          d="M357 254C345 225 320 220 310 230C325 245 345 248 357 254Z"
          fill="#285C46"
        />
        <path
          d="M357 254C355 210 380 195 395 205C390 225 375 245 357 254Z"
          fill="#37533B"
        />
        <path
          d="M357 240C370 215 390 225 395 235C385 245 370 245 357 240Z"
          fill="#285C46"
        />
        <path
          d="M357 245C340 225 330 205 340 195C352 205 355 225 357 245Z"
          fill="#DCE8D9"
        />
      </g>

      {/* Pencil across the base */}
      <g transform="rotate(-18 80 320)">
        <rect x="50" y="316" width="90" height="9" fill="#F3C9A5" />
        <polygon points="140,316 154,320.5 140,325" fill="#F8F6F0" />
        <polygon points="149,319 154,320.5 149,322" fill="#242A24" />
        <rect x="42" y="316" width="8" height="9" fill="#285C46" />
      </g>

      {/* Hand-drawn style Sparkles / Campus Circulation Accents */}
      <g stroke="#285C46" strokeWidth="2" strokeLinecap="round">
        {/* Sparkle 1 */}
        <path d="M100 120V132" />
        <path d="M94 126H106" />
        {/* Sparkle 2 */}
        <path d="M380 140V148" />
        <path d="M376 144H384" />
        {/* Circulation curve loop */}
        <path
          d="M80 190C65 210 65 240 85 255"
          stroke="#DCE8D9"
          strokeWidth="3"
          strokeDasharray="4 4"
        />
        <path
          d="M395 275C415 255 415 225 395 210"
          stroke="#DCE8D9"
          strokeWidth="3"
          strokeDasharray="4 4"
        />
      </g>
    </svg>
  );
};
