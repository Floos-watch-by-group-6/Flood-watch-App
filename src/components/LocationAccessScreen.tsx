import { useState } from 'react';
import floodwatchLogo from '../assets/Floodwatchlogo.svg';

interface LocationAccessScreenProps {
  onBack: () => void;
}

const OPTIONS = ['Never', 'Ask Next Time', 'While Using the App', 'Always'] as const;

function WatermarkLayer() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
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

export default function LocationAccessScreen({ onBack }: LocationAccessScreenProps) {
  const [selected, setSelected] = useState<string | null>(null);

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
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#111827', textAlign: 'center', letterSpacing: '-0.01em' }}>
            Location Access
          </h2>
          <div />
        </div>
      </div>

      <div style={{ position: 'relative', borderTop: '1px solid #E5E7EB' }}>
        {/* Options card */}
        <div style={{
          margin: '24px 18px 0 18px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0px 6px 20px rgba(17, 24, 39, 0.05)',
        }}>
          {OPTIONS.map((opt, i) => {
            const isSelected = selected === opt;
            return (
              <div key={opt}>
                {i > 0 && <div style={{ borderTop: '1px solid #EEF0F2', margin: '0 0 0 18px' }} />}
                <button
                  type="button"
                  onClick={() => setSelected(opt)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '18px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '16px', fontWeight: isSelected ? 600 : 400, color: isSelected ? '#1F2430' : '#9A9AA2' }}>
                    {opt}
                  </span>
                  {isSelected && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M5 12.5l4.5 4.5L19 7" stroke="#123A54" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <p style={{ margin: '18px 22px 0 22px', fontSize: '15px', color: '#6B7280', lineHeight: '1.5', position: 'relative' }}>
          FloodWatch uses your location to auto-fill the location of flood reports and center the map on your area.
        </p>
      </div>
    </div>
  );
}
