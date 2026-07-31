interface AboutModalProps {
  onClose: () => void;
}

export default function AboutModal({ onClose }: AboutModalProps) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(9, 27, 41, 0.45)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '16px',
        zIndex: 60,
        pointerEvents: 'auto',
      }}
    >
      <style>{`
        @keyframes aboutDropDown {
          0%   { opacity: 0; transform: translateY(-24px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '360px',
          marginTop: '8px',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0px 24px 48px rgba(9, 27, 41, 0.28)',
          animation: 'aboutDropDown 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Hero */}
        <div
          style={{
            position: 'relative',
            height: '200px',
            /* Placeholder — swap for the flood hero photo once provided */
            backgroundColor: '#6b7d86',
            backgroundImage: 'linear-gradient(160deg, #8fa3ac 0%, #6b7d86 45%, #4a5b64 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Binocular logo */}
          <svg width="72" height="49" viewBox="0 0 25 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.0813 0.0264446C4.10223 -0.0538295 5.04449 0.121331 5.80344 0.839101C6.21388 1.22723 6.39952 1.43963 6.91599 1.66577C7.82048 1.35088 8.09431 0.488187 9.15771 0.188359C10.375 -0.154881 11.169 -0.0218732 12.2523 0.529043L18.4279 3.69354L20.2826 4.64218C21.0924 5.05494 21.8088 5.36812 22.51 5.9703C23.3796 6.72293 24.0261 7.69967 24.3791 8.79418C24.8814 10.397 24.7242 12.1339 23.9424 13.6206C23.0604 15.3312 21.6869 16.214 19.9137 16.7781C19.732 16.8174 19.5491 16.8512 19.3654 16.8795C17.369 17.1697 15.3542 16.4868 13.9457 15.0424C13.5665 14.6484 13.3231 14.2154 12.9554 13.8302C12.7234 13.6467 12.5019 13.9654 12.4052 14.109C11.4469 15.5323 9.926 16.5735 8.20563 16.8674C6.55257 17.1343 4.86124 16.7323 3.50513 15.7501C2.16115 14.783 1.25725 13.3208 0.992916 11.6862C0.849923 10.832 0.783314 9.84678 0.661063 8.96896C0.488847 7.79025 0.334221 6.60905 0.197324 5.42576C0.125775 4.85687 0.0171896 4.23433 0.00152719 3.66383C-0.0508209 1.75498 1.24789 0.325466 3.0813 0.0264446ZM18.5957 15.7296C21.3758 15.6399 23.5551 13.3107 23.4598 10.5308C23.3645 7.75093 21.0307 5.57639 18.251 5.67741C15.4794 5.77811 13.3125 8.10364 13.4076 10.8755C13.5026 13.6472 15.8237 15.8189 18.5957 15.7296ZM7.4182 15.7212C10.1801 15.5807 12.3089 13.2342 12.1806 10.4718C12.0524 7.70931 9.71535 5.57015 6.95232 5.68617C4.17199 5.80291 2.01644 8.15784 2.14548 10.9376C2.27453 13.7175 4.63899 15.8626 7.4182 15.7212Z" fill="#FFFFFF" />
            <path d="M19.052 9.5918C20.228 9.37698 21.3535 10.1621 21.558 11.3398C21.7626 12.5176 20.9677 13.6362 19.7882 13.8305C18.6232 14.0224 17.5212 13.2393 17.3192 12.076C17.1171 10.9127 17.8905 9.80396 19.052 9.5918Z" fill="#FFFFFF" />
            <path d="M7.78307 9.59207C8.94587 9.3825 10.0599 10.1506 10.2775 11.3119C10.4951 12.4733 9.7347 13.5926 8.57488 13.8181C7.40371 14.0459 6.27104 13.2765 6.05131 12.1038C5.83162 10.931 6.60889 9.8037 7.78307 9.59207Z" fill="#FFFFFF" />
          </svg>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 24px 24px 24px' }}>
          {/* Chat/question icon */}
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '10px' }}>
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.6 9.2a2.4 2.4 0 0 1 4.66.8c0 1.6-2.4 2.4-2.4 2.4" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="16" r="0.5" fill="#9CA3AF" stroke="#9CA3AF" strokeWidth="0.6" />
          </svg>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#091b29', margin: '0 0 14px 0' }}>
            About FloodWatch
          </h2>

          <p style={{ fontSize: '15px', color: '#4B5563', lineHeight: '1.5', margin: '0 0 14px 0' }}>
            Welcome! What if you could know about flooded roads before you reached them?
            FloodWatch helps people make safer travel decisions through real-time flood reporting,
            community verification and location-based alerts.
          </p>

          <p style={{ fontSize: '15px', color: '#4B5563', lineHeight: '1.5', margin: '0 0 14px 0' }}>
            Together we're building safer communities, one report at a time.
          </p>

          <p style={{ fontSize: '15px', color: '#4B5563', lineHeight: '1.5', margin: '0 0 20px 0' }}>
            For more info at{' '}
            <a
              href="https://www.floodwatch.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#2563EB', textDecoration: 'underline' }}
            >
              www.floodwatch.com
            </a>
          </p>

          <div style={{ height: '1px', backgroundColor: '#EEF0F2', margin: '0 0 16px 0' }} />

          <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '0 0 8px 0' }}>Version 1.0.0</p>
          <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>© 2026 FloodWatch</p>
        </div>
      </div>
    </div>
  );
}
