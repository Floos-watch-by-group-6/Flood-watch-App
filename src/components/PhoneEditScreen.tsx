import floodwatchLogo from '../assets/Floodwatchlogo.svg';

interface PhoneEditScreenProps {
  currentPhone: string;
  onBack: () => void;
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

export default function PhoneEditScreen({ currentPhone, onBack }: PhoneEditScreenProps) {
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
            Phone Number
          </h2>
          <div />
        </div>
      </div>

      <div style={{ position: 'relative', borderTop: '1px solid #E5E7EB' }}>
        <div style={{ padding: '32px 24px 0 24px' }}>
          <p style={{ fontSize: '18px', color: '#6B7280', lineHeight: '1.5', margin: '0 0 32px 0' }}>
            Your phone number is used to log in and receive verification codes. It won't be visible to others.{' '}
            <span style={{ color: '#111827', fontWeight: '600', textDecoration: 'underline', cursor: 'pointer' }}>Learn more</span>
          </p>

          <div style={{ fontSize: '15px', color: '#9CA3AF', marginBottom: '8px' }}>Phone</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#1F2430', marginBottom: '20px' }}>
            {currentPhone}
          </div>

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
        </div>
      </div>
    </div>
  );
}
