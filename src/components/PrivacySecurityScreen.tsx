import floodwatchLogo from '../assets/Floodwatchlogo.svg';

interface PrivacySecurityScreenProps {
  onBack: () => void;
  onChangePassword: () => void;
  onDeleteAccount: () => void;
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

export default function PrivacySecurityScreen({ onBack, onChangePassword, onDeleteAccount }: PrivacySecurityScreenProps) {
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
            Privacy &amp; Security
          </h2>
          <div />
        </div>
      </div>

      <div style={{ position: 'relative', borderTop: '1px solid #E5E7EB' }}>
        {/* Anonymous Reporting — locked always-on */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '22px 24px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
            <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-4.5 7.79" stroke="#1F5C4E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '17px', fontWeight: '700', color: '#B9BFC7' }}>Anonymous Reporting</div>
            <div style={{ fontSize: '14px', color: '#B9BFC7', marginTop: '2px' }}>Only your username is ever shown to others</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '8px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="6" y="10" width="12" height="9" rx="2" stroke="#1F5C4E" strokeWidth="1.7" />
                <path d="M8.5 10V7.5a3.5 3.5 0 017 0" stroke="#1F5C4E" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: '13px', color: '#1F5C4E', fontWeight: '600' }}>Always on</span>
            </div>
          </div>
          <div style={{
            width: '50px', height: '28px', borderRadius: '999px', backgroundColor: '#E5E7EB',
            display: 'flex', alignItems: 'center', padding: '3px', flexShrink: 0, boxSizing: 'border-box',
          }}>
            <div style={{
              width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#FFFFFF',
              boxShadow: '0px 1px 3px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="#9CA3AF" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #EEF0F2', margin: '0 24px' }} />

        {/* Change password */}
        <div
          onClick={onChangePassword}
          style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px', cursor: 'pointer' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="#1F5C4E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '17px', fontWeight: '700', color: '#111827' }}>Change password</div>
            <div style={{ fontSize: '14px', color: '#9CA3AF', marginTop: '2px' }}>Update your account password</div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M9 6l6 6-6 6" stroke="#C4C9D1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div style={{ borderTop: '1px solid #EEF0F2', margin: '0 24px' }} />

        {/* Delete My Account */}
        <div
          onClick={onDeleteAccount}
          style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px', cursor: 'pointer' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <rect x="4" y="4" width="16" height="16" rx="6" stroke="#EF4444" strokeWidth="1.8" />
            <rect x="9" y="11" width="6" height="5" rx="1.3" stroke="#EF4444" strokeWidth="1.6" />
            <path d="M10.3 11V9.3a1.7 1.7 0 013.4 0V11" stroke="#EF4444" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '17px', fontWeight: '700', color: '#EF4444' }}>Delete My Account</div>
            <div style={{ fontSize: '14px', color: '#9CA3AF', marginTop: '2px' }}>Permanently remove your account</div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M9 6l6 6-6 6" stroke="#C4C9D1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
