export type WeatherCondition = 'sunny' | 'cloudy' | 'thunderstorm' | 'clearing';

interface WeatherModalProps {
  location: string;
  onClose: () => void;
  condition?: WeatherCondition;
}

type IconKind = 'sun' | 'cloud' | 'cloud-light' | 'rain' | 'storm' | 'clearing';

const NAVY = '#262537';        // temps / headings
const CLOUD_BLUE = '#0E4567';  // Cute-Blue/500 hourly cloud outline
const CLOUD_STEEL = '#86A2B3'; // Cute-Blue/200 main cloudy glyph
const CORAL = '#FFA084';       // Orange/400 clearing-up glyph
const SUN_GRAD = 'url(#wm-sun)';

/* ── Weather glyphs ── */
function SunIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="6.4" stroke={SUN_GRAD} strokeWidth="1.9" />
      <path
        d="M16 3.2v3.2M16 25.6v3.2M3.2 16h3.2M25.6 16h3.2M6.9 6.9l2.25 2.25M22.85 22.85l2.25 2.25M25.1 6.9l-2.25 2.25M9.15 22.85L6.9 25.1"
        stroke={SUN_GRAD} strokeWidth="1.9" strokeLinecap="round"
      />
    </svg>
  );
}

function CloudIcon({ size = 28, color = CLOUD_BLUE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M9.6 23a5.6 5.6 0 01.5-11.17A7.1 7.1 0 0123.2 13.3h.25a4.85 4.85 0 010 9.7H10a5.4 5.4 0 01-.4 0z"
        stroke={color} strokeWidth="1.9" strokeLinejoin="round"
      />
    </svg>
  );
}

// Coral sun peeking behind a cloud (clearing up).
function ClearingIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="10.5" cy="10.5" r="4.8" stroke={CORAL} strokeWidth="1.9" />
      <path
        d="M11 25.5a5.5 5.5 0 01.5-10.97A6.9 6.9 0 0124.2 15.8h.25a4.75 4.75 0 010 9.5H11.4a5.3 5.3 0 01-.4 0z"
        fill="#FFFFFF" stroke={CORAL} strokeWidth="1.9" strokeLinejoin="round"
      />
    </svg>
  );
}

function renderGlyph(kind: IconKind, size: number) {
  switch (kind) {
    case 'sun': return <SunIcon size={size} />;
    case 'cloud': return <CloudIcon size={size} />;
    case 'cloud-light': return <CloudIcon size={size} color={CLOUD_STEEL} />;
    case 'clearing': return <ClearingIcon size={size} />;
    default: return <CloudIcon size={size} />;
  }
}

/* ── Section eyebrow icons ── */
function InfoCircle({ size = 22, color = '#4B4B57' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.7" />
      <path d="M12 11v5.2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="7.9" r="1" fill={color} />
    </svg>
  );
}

function AlertCircle({ size = 22, color = '#4B4B57' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.7" />
      <path d="M12 7.5v5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16.2" r="1" fill={color} />
    </svg>
  );
}

function ClockIcon({ size = 15, color = '#9CA3AF' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="13" r="8" stroke={color} strokeWidth="1.7" />
      <path d="M12 9.2V13l2.6 1.6" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 3.5h5" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

/* ── Data (one entry per condition; missing conditions fall back to sunny) ── */
interface HourEntry { label: string; temp: string; icon: IconKind }
interface ConditionData {
  mainIcon: IconKind;
  temp: string;
  label: string;
  feelsLike: string;
  updateTitle: string;
  updateIcon: 'info' | 'alert';
  updateText: string;
  hourly: HourEntry[];
  details: { rainChance: string; wind: string; humidity: string; updated: string };
}

const DATA: Partial<Record<WeatherCondition, ConditionData>> = {
  sunny: {
    mainIcon: 'sun',
    temp: '31°',
    label: 'Sunny',
    feelsLike: 'Feels like 33° · H:32° L:23°',
    updateTitle: 'Weather Update',
    updateIcon: 'info',
    updateText: 'Clear skies expected for the rest of the day. Flood risk is low right now.',
    hourly: [
      { label: 'Now', temp: '31°', icon: 'sun' },
      { label: '10PM', temp: '29°', icon: 'sun' },
      { label: '11PM', temp: '26°', icon: 'cloud' },
      { label: '12PM', temp: '25°', icon: 'cloud' },
      { label: '1PM', temp: '24°', icon: 'cloud' },
    ],
    details: { rainChance: '5%', wind: '8 km/h', humidity: '54%', updated: '3 min ago' },
  },
  clearing: {
    mainIcon: 'clearing',
    temp: '24°',
    label: 'Clearing Up',
    feelsLike: 'Feels like 25° · H:26° L:21°',
    updateTitle: 'Weather Update',
    updateIcon: 'alert',
    updateText: "Rain has stopped. If flooding remains nearby, tap Report to let others know it's still an issue.",
    hourly: [
      { label: 'Now', temp: '24°', icon: 'clearing' },
      { label: '10PM', temp: '25°', icon: 'sun' },
      { label: '11PM', temp: '25°', icon: 'sun' },
      { label: '12PM', temp: '23°', icon: 'cloud' },
      { label: '1PM', temp: '22°', icon: 'cloud' },
    ],
    details: { rainChance: '20%', wind: '10 km/h', humidity: '80%', updated: 'Just now' },
  },
  cloudy: {
    mainIcon: 'cloud-light',
    temp: '26°',
    label: 'Cloudy',
    feelsLike: 'Feels like 26° · H:26° L:23°',
    updateTitle: 'Weather Update',
    updateIcon: 'alert',
    updateText: 'Cloudy conditions will continue for the rest of the day. No rain expected. Flood risk is low.',
    hourly: [
      { label: 'Now', temp: '25°', icon: 'cloud' },
      { label: '10PM', temp: '24°', icon: 'cloud' },
      { label: '11PM', temp: '23°', icon: 'cloud' },
      { label: '12PM', temp: '23°', icon: 'cloud' },
      { label: '1PM', temp: '24°', icon: 'cloud' },
    ],
    details: { rainChance: '15%', wind: '11 km/h', humidity: '70%', updated: '5 min ago' },
  },
};

function DetailCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{
      flex: 1,
      backgroundColor: '#FFFFFF',
      border: '1px solid #F0F0F0',
      borderRadius: '16px',
      padding: '16px',
      boxShadow: '0px 6px 18px rgba(17, 24, 39, 0.05)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '10px' }}>
        {icon}
        <span style={{ fontSize: '13px', color: '#9CA3AF' }}>{label}</span>
      </div>
      <div style={{ fontSize: '22px', fontWeight: 600, color: NAVY }}>{value}</div>
    </div>
  );
}

const eyebrow: React.CSSProperties = { fontSize: '12px', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.06em' };

export default function WeatherModal({ location, onClose, condition = 'sunny' }: WeatherModalProps) {
  const data = DATA[condition] ?? DATA.sunny!;

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
        {/* Shared sun gradient */}
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
          <defs>
            <linearGradient id="wm-sun" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0" stopColor="#EFC977" />
              <stop offset="1" stopColor="#E17658" />
            </linearGradient>
          </defs>
        </svg>

        {/* Grabber */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{ width: '40px', height: '5px', borderRadius: '3px', backgroundColor: '#C4C9D1' }} />
        </div>

        {/* Current weather */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '15px', color: '#9CA3AF', marginBottom: '4px' }}>{location}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
            {renderGlyph(data.mainIcon, 54)}
            <span style={{ fontSize: '52px', fontWeight: 700, color: NAVY, lineHeight: 1 }}>{data.temp}</span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 500, color: NAVY, marginTop: '10px' }}>{data.label}</div>
          <div style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '6px' }}>{data.feelsLike}</div>
        </div>

        <div style={{ height: '18px' }} />

        {/* Weather update */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '12px' }}>
          {data.updateIcon === 'alert'
            ? <AlertCircle size={24} color="#4B4B57" />
            : <InfoCircle size={24} color="#4B4B57" />}
          <span style={{ fontSize: '18px', fontWeight: 600, color: NAVY }}>{data.updateTitle}</span>
        </div>
        <p style={{ margin: 0, fontSize: '14px', color: '#9CA3AF', lineHeight: '1.6' }}>
          {data.updateText}
        </p>

        <div style={{ borderTop: '1px solid #EEF0F2', margin: '22px 0' }} />

        {/* Hourly forecast */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '18px' }}>
          <ClockIcon size={15} />
          <span style={eyebrow}>HOURLY FORECAST</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          {data.hourly.map((h) => (
            <div key={h.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', flex: 1 }}>
              <span style={{ fontSize: '13px', color: '#9CA3AF' }}>{h.label}</span>
              {renderGlyph(h.icon, h.icon === 'sun' ? 26 : 28)}
              <span style={{ fontSize: '15px', fontWeight: 600, color: NAVY }}>{h.temp}</span>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #EEF0F2', margin: '22px 0' }} />

        {/* Details */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '16px' }}>
          <InfoCircle size={15} color="#9CA3AF" />
          <span style={eyebrow}>DETAILS</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <DetailCard
              icon={<CloudIcon size={18} color="#8A8A93" />}
              label="Rain Chance"
              value={data.details.rainChance}
            />
            <DetailCard
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 8h11a2.5 2.5 0 10-2.5-2.5M3 12h15a2.5 2.5 0 11-2.5 2.5M3 16h9a2 2 0 11-2 2" stroke="#8A8A93" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              label="Wind"
              value={data.details.wind}
            />
          </div>
          <div style={{ display: 'flex', gap: '14px' }}>
            <DetailCard
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z" stroke="#8A8A93" strokeWidth="1.6" strokeLinejoin="round" /></svg>}
              label="Humidity"
              value={data.details.humidity}
            />
            <DetailCard
              icon={<ClockIcon size={17} color="#8A8A93" />}
              label="Updated"
              value={data.details.updated}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
