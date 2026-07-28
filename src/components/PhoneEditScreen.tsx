import { useState } from 'react';
import floodwatchLogo from '../assets/Floodwatchlogo.svg';

interface PhoneEditScreenProps {
  currentPhone: string;
  onBack: () => void;
  onSave: (phone: string) => void;
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

export default function PhoneEditScreen({ currentPhone, onBack, onSave }: PhoneEditScreenProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(currentPhone);

  const handleSave = () => {
    const trimmed = value.trim();
    if (trimmed) {
      onSave(trimmed);
      setEditing(false);
    }
  };

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
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '600', color: '#111827', textAlign: 'center', letterSpacing: '-0.01em' }}>
            Phone Number
          </h2>
          <button
            type="button"
            onClick={() => { setValue(currentPhone); setEditing(true); }}
            style={{
              width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FFFFFF', border: 'none',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', justifySelf: 'end',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div style={{ position: 'relative', borderTop: '1px solid #E5E7EB' }}>
        <div style={{ padding: '32px 24px 0 24px' }}>
          <p style={{ fontSize: '18px', color: '#6B7280', lineHeight: '1.5', margin: '0 0 32px 0' }}>
            Your phone number is used to log in and receive verification codes. It won't be visible to others.{' '}
            <span style={{ color: '#111827', fontWeight: '600', textDecoration: 'underline', cursor: 'pointer' }}>Learn more</span>
          </p>

          <div style={{ fontSize: '15px', color: '#9CA3AF', marginBottom: '8px' }}>Phone</div>

          {editing ? (
            <>
              <input
                type="tel"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="Enter phone number"
                autoFocus
                style={{
                  width: '100%', fontSize: '22px', fontWeight: '600', color: '#1F2430',
                  border: 'none', borderBottom: '2px solid #1F5C4E', backgroundColor: 'transparent',
                  outline: 'none', padding: '4px 0 8px 0', marginBottom: '24px',
                  fontFamily: 'inherit', boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  style={{
                    flex: 1, padding: '14px', borderRadius: '999px', border: '1.5px solid #D1D5DB',
                    backgroundColor: '#FFFFFF', fontSize: '15px', fontWeight: '600', color: '#6B7280',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  style={{
                    flex: 1, padding: '14px', borderRadius: '999px', border: 'none',
                    backgroundColor: '#0E3D5C', fontSize: '15px', fontWeight: '600', color: '#FFFFFF',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Save
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '28px', fontWeight: '700', color: currentPhone ? '#1F2430' : '#9CA3AF', marginBottom: '20px' }}>
                {currentPhone || 'Not added yet'}
              </div>
              {currentPhone && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#1F5C4E',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12.5l4.5 4.5L19 7" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span style={{ fontSize: '17px', fontWeight: '700', color: '#1F5C4E' }}>Verified</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
