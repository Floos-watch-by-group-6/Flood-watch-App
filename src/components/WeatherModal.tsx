interface WeatherModalProps {
  location: string;
  onClose: () => void;
}

const NAVY = '#123A54';
const ORANGE = '#E8912E';

function RainIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M9.5 19.5a5.5 5.5 0 01.6-10.97A6.5 6.5 0 0122.9 9.5h.35a4.75 4.75 0 010 9.5H10a4.9 4.9 0 01-.5 0z" stroke={NAVY} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M11 22l-1.4 3M16 22l-1.4 3M21 22l-1.4 3" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SunIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="6" stroke={ORANGE} strokeWidth="1.8" />
      <path d="M16 3v3M16 26v3M3 16h3M26 16h3M6.5 6.5l2.1 2.1M23.4 23.4l2.1 2.1M25.5 6.5l-2.1 2.1M8.6 23.4l-2.1 2.1" stroke={ORANGE} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const HOURLY = [
  { label: 'Now', temp: '21°', kind: 'rain' as const },
  { label: '10PM', temp: '21°', kind: 'rain' as const },
  { label: '11PM', temp: '19°', kind: 'sun' as const },
  { label: '12PM', temp: '19°', kind: 'sun' as const },
  { label: '1PM', temp: '19°', kind: 'sun' as const },
];

function DetailCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ flex: 1, backgroundColor: '#F4F5F6', borderRadius: '16px', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '10px' }}>
        {icon}
        <span style={{ fontSize: '13px', color: '#9CA3AF' }}>{label}</span>
      </div>
      <div style={{ fontSize: '22px', fontWeight: 700, color: '#1F2430' }}>{value}</div>
    </div>
  );
}

export default function WeatherModal({ location, onClose }: WeatherModalProps) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxHeight: '92%',
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          overflowY: 'auto',
          fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          boxShadow: '0px -10px 40px rgba(0, 0, 0, 0.25)',
          animation: 'sheetSlideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1) both',
          padding: '12px 22px max(28px, env(safe-area-inset-bottom)) 22px',
          boxSizing: 'border-box',
        }}
      >
        {/* Grabber */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{ width: '40px', height: '5px', borderRadius: '3px', backgroundColor: '#C4C9D1' }} />
        </div>

        {/* Current weather */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '15px', color: '#6B7280', marginBottom: '6px' }}>{location}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
            <RainIcon size={54} />
            <span style={{ fontSize: '52px', fontWeight: 700, color: '#1F2430', lineHeight: 1 }}>27°</span>
          </div>
          <div style={{ fontSize: '19px', color: '#6B7280', marginTop: '10px' }}>Heavy Rain</div>
          <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '6px' }}>Feels like 29° · H:28° L:24°</div>
        </div>

        <div style={{ borderTop: '1px solid #EEF0F2', margin: '22px 0' }} />

        {/* Special weather statement */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '12px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M10.3 3.86L1.82 18a1 1 0 00.86 1.5h18.64a1 1 0 00.86-1.5L13.71 3.86a1 1 0 00-1.72 0z" stroke="#4B4B57" strokeWidth="1.7" strokeLinejoin="round" />
            <line x1="12" y1="9" x2="12" y2="13" stroke="#4B4B57" strokeWidth="1.7" strokeLinecap="round" />
            <circle cx="12" cy="16.3" r="1" fill="#4B4B57" />
          </svg>
          <span style={{ fontSize: '17px', fontWeight: 700, color: '#1F2430' }}>Special Weather Statement</span>
        </div>
        <p style={{ margin: 0, fontSize: '14px', color: '#9CA3AF', lineHeight: '1.6' }}>
          Rain expected to continue for 2 more hours. Flooding is more likely on low-lying roads during this time, seen any? Tap Report to let others know.
        </p>

        <div style={{ borderTop: '1px solid #EEF0F2', margin: '22px 0' }} />

        {/* Hourly forecast */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '16px' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#9CA3AF" strokeWidth="1.7" />
            <path d="M12 7.5V12l3 2" stroke="#9CA3AF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.06em' }}>HOURLY FORECAST</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          {HOURLY.map((h) => (
            <div key={h.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', flex: 1 }}>
              <span style={{ fontSize: '13px', color: '#6B7280' }}>{h.label}</span>
              {h.kind === 'rain' ? <RainIcon size={30} /> : <SunIcon size={26} />}
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#1F2430' }}>{h.temp}</span>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #EEF0F2', margin: '22px 0' }} />

        {/* Details */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '16px' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#9CA3AF" strokeWidth="1.6" />
            <path d="M12 11v5.5" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="7.8" r="1" fill="#9CA3AF" />
          </svg>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.06em' }}>DETAILS</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <DetailCard
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 15a4 4 0 01.5-8A5.5 5.5 0 0117 8h.3a3.7 3.7 0 010 7.4H7" stroke="#8A8A93" strokeWidth="1.6" strokeLinejoin="round" /><path d="M9 18l-1 2M14 18l-1 2" stroke="#8A8A93" strokeWidth="1.6" strokeLinecap="round" /></svg>}
              label="Rain Chance"
              value="90%"
            />
            <DetailCard
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 8h11a2.5 2.5 0 10-2.5-2.5M3 12h15a2.5 2.5 0 11-2.5 2.5M3 16h9a2 2 0 11-2 2" stroke="#8A8A93" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              label="Wind"
              value="14km/h"
            />
          </div>
          <div style={{ display: 'flex', gap: '14px' }}>
            <DetailCard
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z" stroke="#8A8A93" strokeWidth="1.6" strokeLinejoin="round" /></svg>}
              label="Humidity"
              value="88%"
            />
            <DetailCard
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#8A8A93" strokeWidth="1.6" /><path d="M12 7.5V12l3 2" stroke="#8A8A93" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              label="Updated"
              value="3 min ago"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
