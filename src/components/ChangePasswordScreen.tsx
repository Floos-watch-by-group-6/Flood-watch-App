import { useState } from 'react';
import floodwatchLogo from '../assets/Floodwatchlogo.svg';

interface ChangePasswordScreenProps {
  onBack: () => void;
  onSubmit: (currentPassword: string, newPassword: string) => void;
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

function EyeToggle({ visible, onClick }: { visible: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: 'absolute',
        right: '18px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#6B7280',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {visible ? (
        <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ) : (
        <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M3 3l18 18" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M10.584 10.587a2 2 0 002.829 2.829" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M9.363 5.365A9.466 9.466 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.523 10.523 0 01-2.02 3.568M6.228 6.228C4.42 7.36 3.036 9.026 2.458 12c.639 2.107 1.936 3.87 3.646 5.043" />
        </svg>
      )}
    </button>
  );
}

export default function ChangePasswordScreen({ onBack, onSubmit }: ChangePasswordScreenProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const isValid = currentPassword.length > 0 && newPassword.length > 0;

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '18px 52px 18px 20px',
    borderRadius: '26px',
    border: '1.5px solid #E5E7EB',
    backgroundColor: '#FFFFFF',
    fontSize: '17px',
    color: '#1F2430',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '16px',
    color: '#6B7280',
    marginBottom: '10px',
    fontWeight: 400,
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
          <h2 style={{ margin: 0, fontSize: '26px', fontWeight: 700, color: '#111827', textAlign: 'center', letterSpacing: '-0.01em' }}>
            Change Password
          </h2>
          <div />
        </div>
      </div>

      <div style={{ position: 'relative', borderTop: '1px solid #E5E7EB' }}>
        <div style={{ padding: '40px 24px 0 24px' }}>
          {/* Lock scan icon */}
          <svg width="104" height="104" viewBox="0 0 100 100" fill="none" style={{ margin: '0 auto 30px auto', display: 'block' }}>
            <path d="M14 34 V22 A8 8 0 0 1 22 14 H34" stroke="#8CA5B8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M66 14 H78 A8 8 0 0 1 86 22 V34" stroke="#8CA5B8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M86 66 V78 A8 8 0 0 1 78 86 H66" stroke="#8CA5B8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M34 86 H22 A8 8 0 0 1 14 78 V66" stroke="#8CA5B8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="35" y="47" width="30" height="24" rx="6" stroke="#8CA5B8" strokeWidth="5" />
            <path d="M40 47 V41 A10 10 0 0 1 60 41 V47" stroke="#8CA5B8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="50" cy="57" r="2.6" fill="#8CA5B8" />
          </svg>

          <p style={{ fontSize: '18px', color: '#6B7280', lineHeight: '1.5', margin: '0 0 34px 0' }}>
            Choose a strong password and don't reuse it for other accounts.{' '}
            <span style={{ color: '#111827', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>Learn more</span>
          </p>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Current Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your password"
                style={inputStyle}
              />
              <EyeToggle visible={showCurrent} onClick={() => setShowCurrent(v => !v)} />
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={labelStyle}>New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your password"
                style={inputStyle}
              />
              <EyeToggle visible={showNew} onClick={() => setShowNew(v => !v)} />
            </div>
          </div>

          <button
            type="button"
            disabled={!isValid}
            onClick={() => onSubmit(currentPassword, newPassword)}
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: '999px',
              backgroundColor: isValid ? '#0E3D5C' : '#8DA4B8',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '17px',
              fontWeight: 700,
              cursor: isValid ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.25s ease',
            }}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
