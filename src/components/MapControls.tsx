import { useState } from 'react';

interface MapControlsProps {
  handleRecenterLocation: () => void;
  handleInfoClick?: () => void; // Keeps support for optional parent notifications
}

const severityLevels = [
  { color: '#F5322D', label: 'High severity' },
  { color: '#F59E0B', label: 'Medium severity' },
  { color: '#FBD268', label: 'Low severity' },
];

const statusLevels: { emphasis: string; before: string; kind: 'solid' | 'pulsing' | 'faded' }[] = [
  { before: 'Verified report: ', emphasis: 'solid ring', kind: 'solid' },
  { before: 'Unverified report: ', emphasis: 'pulsing', kind: 'pulsing' },
  { before: 'Likely resolved: ', emphasis: 'faded', kind: 'faded' },
];

function StatusIndicator({ kind }: { kind: 'solid' | 'pulsing' | 'faded' }) {
  if (kind === 'solid') {
    return (
      <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#9CA3AF' }} />
      </div>
    );
  }
  if (kind === 'pulsing') {
    return (
      <div style={{ width: '20px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
        <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#8A8A93' }} />
      </div>
    );
  }
  return (
    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #D8DBDF', flexShrink: 0 }} />
  );
}

export default function MapControls({ handleRecenterLocation, handleInfoClick }: MapControlsProps) {
  const [showLegend, setShowLegend] = useState(false);

  const toggleLegend = () => {
    setShowLegend((v) => !v);
    if (handleInfoClick) handleInfoClick();
  };

  return (
    <>
      {/* Map Key Modal */}
      {showLegend && (
        <div
          onClick={() => setShowLegend(false)}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 40,
            backgroundColor: 'rgba(0, 0, 0, 0.28)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            boxSizing: 'border-box',
            pointerEvents: 'auto',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '320px',
              backgroundColor: '#FFFFFF',
              borderRadius: '28px',
              padding: '28px 26px',
              boxShadow: '0px 24px 60px rgba(0, 0, 0, 0.22)',
              fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              boxSizing: 'border-box',
            }}
          >
            <h2 style={{ fontSize: '21px', fontWeight: 600, color: '#1F2430', margin: '0 0 10px 0', letterSpacing: '-0.01em' }}>Map key</h2>
            <p style={{ fontSize: '15px', color: '#6B7280', margin: '0 0 24px 0', lineHeight: '1.5' }}>
              Color always = severity. Ring style always = status.
            </p>

            {/* Severity */}
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1F2430', margin: '0 0 16px 0' }}>Severity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {severityLevels.map((level) => (
                <div key={level.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: level.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '15px', color: '#1F2430' }}>{level.label}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #EEF0F2', margin: '20px 0' }} />

            {/* Status */}
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1F2430', margin: '0 0 16px 0' }}>Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {statusLevels.map((level) => (
                <div key={level.emphasis} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <StatusIndicator kind={level.kind} />
                  <span style={{ fontSize: '15px', color: '#1F2430' }}>
                    {level.before}<span style={{ fontWeight: 700 }}>{level.emphasis}</span>
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #EEF0F2', margin: '20px 0' }} />

            {/* Your location */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#2563EB' }} />
              </div>
              <span style={{ fontSize: '15px', color: '#1F2430' }}>Your location</span>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          right: '16px',
          bottom: '150px',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '12px',
          pointerEvents: 'auto',
        }}
      >
        {/* Information (i) Button */}
        <button
          onClick={toggleLegend}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: showLegend ? '#F3F4F6' : '#FFFFFF',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </button>

        {/* Recenter Location Button */}
        <button
          onClick={handleRecenterLocation}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#FFFFFF',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)',
            cursor: 'pointer',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000205" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="8" />
            <line x1="12" y1="1" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="23" />
            <line x1="1" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="23" y2="12" />
          </svg>
        </button>
      </div>
    </>
  );
}
