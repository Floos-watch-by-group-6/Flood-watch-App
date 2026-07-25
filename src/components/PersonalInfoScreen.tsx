import floodwatchLogo from '../assets/Floodwatchlogo.svg';

interface PersonalInfoScreenProps {
  onBack: () => void;
  onOpenUsername: () => void;
  onOpenPhone: () => void;
  onOpenEmail: () => void;
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

function InfoRow({ path, label, onClick }: { path: string; label: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 24px', cursor: onClick ? 'pointer' : 'default' }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
        <path d={path} stroke="#1F5C4E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontSize: '17px', fontWeight: '700', color: '#111827' }}>{label}</span>
    </div>
  );
}

export default function PersonalInfoScreen({ onBack, onOpenUsername, onOpenPhone, onOpenEmail }: PersonalInfoScreenProps) {
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
            Personal Information
          </h2>
          <div />
        </div>
      </div>

      <div style={{ position: 'relative', borderTop: '1px solid #E5E7EB' }}>
        <div style={{ padding: '20px 24px 4px 24px' }}>
          <span style={{ fontSize: '14px', color: '#9CA3AF' }}>Account &amp; Preferences</span>
        </div>

        <InfoRow
          path="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-4.5 7.79"
          label="Username"
          onClick={onOpenUsername}
        />
        <InfoRow
          path="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          label="Phone number"
          onClick={onOpenPhone}
        />
        <InfoRow
          path="M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1zM4 7l8 6 8-6M19 4l1 1-1 1"
          label="Email address"
          onClick={onOpenEmail}
        />
      </div>
    </div>
  );
}
