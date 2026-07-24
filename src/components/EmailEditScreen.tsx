import { useEffect, useRef, useState } from 'react';
import floodwatchLogo from '../assets/Floodwatchlogo.svg';

interface EmailEditScreenProps {
  currentEmail: string;
  onBack: () => void;
  onSave: (newEmail: string) => void;
}

function WatermarkLayer() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.005)',
        WebkitMaskImage: `url(${floodwatchLogo})`,
        maskImage: `url(${floodwatchLogo})`,
        WebkitMaskSize: '56px 56px',
        maskSize: '56px 56px',
        WebkitMaskRepeat: 'repeat',
        maskRepeat: 'repeat',
        pointerEvents: 'none',
      }}
    />
  );
}

export default function EmailEditScreen({ currentEmail, onBack, onSave }: EmailEditScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(currentEmail);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const handleToggle = () => {
    if (isEditing) {
      onSave(draft.trim());
      setIsEditing(false);
    } else {
      setDraft(currentEmail);
      setIsEditing(true);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: '#F6F7F8',
      overflowY: 'auto',
      zIndex: 2,
      fontFamily: '"Euclid", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
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
          <h2 style={{ margin: 0, fontSize: '26px', fontWeight: '700', color: '#111827', textAlign: 'center', letterSpacing: '-0.01em' }}>
            Email Address
          </h2>
          <button
            type="button"
            onClick={handleToggle}
            style={{
              justifySelf: 'end', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: '17px', fontWeight: '600', color: '#0B4C7A',
            }}
          >
            {isEditing ? 'Done' : 'Edit'}
          </button>
        </div>
      </div>

      <div style={{ position: 'relative', borderTop: '1px solid #E5E7EB' }}>
        <div style={{ padding: '40px 32px 0 32px', textAlign: 'center' }}>
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 24px auto', display: 'block' }}>
            <circle cx="12" cy="12" r="9.5" stroke="#5C86A8" strokeWidth="1.3" />
            <rect x="6.5" y="8.5" width="11" height="8" rx="1.2" stroke="#5C86A8" strokeWidth="1.3" />
            <path d="M6.9 9l5.1 4 5.1-4" stroke="#5C86A8" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          {isEditing ? (
            <input
              ref={inputRef}
              type="email"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleToggle(); }}
              placeholder="Add your email address"
              style={{
                width: '100%',
                textAlign: 'center',
                fontSize: '28px',
                fontWeight: '700',
                color: '#9CA3AF',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          ) : (
            <div style={{ fontSize: currentEmail ? '28px' : '20px', fontWeight: '700', color: currentEmail ? '#1F2430' : '#9CA3AF' }}>
              {currentEmail || 'Add your email address'}
            </div>
          )}

          <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: '1.6', margin: '24px 0 0 0', textAlign: 'left' }}>
            Your email address is used for account recovery and important notifications. It is never shown publicly to other users.{' '}
            <span style={{ color: '#111827', fontWeight: '700', textDecoration: 'underline', cursor: 'pointer' }}>Learn more</span>
          </p>
        </div>
      </div>
    </div>
  );
}
