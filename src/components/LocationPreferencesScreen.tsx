import { useState } from 'react';
import floodwatchLogo from '../assets/Floodwatchlogo.svg';

interface LocationPreferencesScreenProps {
  onBack: () => void;
  defaultZone: string;
  onOpenLocationAccess?: () => void;
  onOpenDefaultZone?: () => void;
}

function WatermarkLayer() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.005)',
        WebkitMaskImage: `url("${floodwatchLogo}")`,
        maskImage: `url("${floodwatchLogo}")`,
        WebkitMaskSize: '56px 56px',
        maskSize: '56px 56px',
        WebkitMaskRepeat: 'repeat',
        maskRepeat: 'repeat',
        pointerEvents: 'none',
      }}
    />
  );
}

function Chevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M9 6l6 6-6 6" stroke="#C4C9D1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LocationPreferencesScreen({ onBack, defaultZone, onOpenLocationAccess, onOpenDefaultZone }: LocationPreferencesScreenProps) {
  const [precise, setPrecise] = useState(true);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: '#F6F7F8',
      overflowY: 'auto',
      zIndex: 2,
      fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <WatermarkLayer />

      <div style={{ position: 'relative', padding: '52px 20px 20px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr 48px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FFFFFF', border: 'none',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 5l-7 7 7 7" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 600, color: '#111827', textAlign: 'center', letterSpacing: '-0.01em' }}>
            Location Preferences
          </h2>
          <div />
        </div>
      </div>

      <div style={{ position: 'relative', borderTop: '1px solid #E5E7EB' }}>
        {/* Location Access */}
        <div
          onClick={onOpenLocationAccess}
          style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px', cursor: onOpenLocationAccess ? 'pointer' : 'default' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M12 21c4.5-4.2 7-7.6 7-11a7 7 0 10-14 0c0 3.4 2.5 6.8 7 11z" stroke="#1F5C4E" strokeWidth="1.8" strokeLinejoin="round" />
            <circle cx="12" cy="10" r="2.6" stroke="#1F5C4E" strokeWidth="1.8" />
          </svg>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '14px', fontWeight: 500, color: '#262537' }}>Location Access</div>
            <div style={{ fontSize: '14px', color: '#9CA3AF', marginTop: '2px' }}>Opens your device's system settings</div>
          </div>
          <Chevron />
        </div>

        <div style={{ borderTop: '1px solid #EEF0F2', margin: '0 24px' }} />

        {/* Precise Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="4" stroke="#1F5C4E" strokeWidth="1.8" />
            <circle cx="12" cy="12" r="1.4" fill="#1F5C4E" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="#1F5C4E" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '14px', fontWeight: 500, color: '#262537' }}>Precise Location</div>
            <div style={{ fontSize: '14px', color: '#9CA3AF', marginTop: '2px' }}>More accurate flood reports</div>
          </div>
          <button
            type="button"
            onClick={() => setPrecise(v => !v)}
            aria-label="Toggle precise location"
            style={{
              width: '52px',
              height: '30px',
              borderRadius: '999px',
              backgroundColor: precise ? '#123A54' : '#D1D5DB',
              border: 'none',
              cursor: 'pointer',
              padding: '3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: precise ? 'flex-end' : 'flex-start',
              flexShrink: 0,
              transition: 'background-color 0.2s ease',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#FFFFFF', boxShadow: '0px 1px 3px rgba(0,0,0,0.2)' }} />
          </button>
        </div>

        {/* Default Zone */}
        <div
          onClick={onOpenDefaultZone}
          style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px', cursor: onOpenDefaultZone ? 'pointer' : 'default' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="7" stroke="#1F5C4E" strokeWidth="1.8" />
            <line x1="21" y1="21" x2="16.5" y2="16.5" stroke="#1F5C4E" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '14px', fontWeight: 500, color: '#262537' }}>Default Zone</div>
            <div style={{ fontSize: '14px', color: '#9CA3AF', marginTop: '2px' }}>{defaultZone}</div>
          </div>
          <Chevron />
        </div>
      </div>
    </div>
  );
}
