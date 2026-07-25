import type { CSSProperties } from 'react';

interface PhotoPermissionModalProps {
  onSelectPhotos: () => void;
  onAllowAll: () => void;
  onDontAllow: () => void;
}

export default function PhotoPermissionModal({ onSelectPhotos, onAllowAll, onDontAllow }: PhotoPermissionModalProps) {
  const buttonStyle: CSSProperties = {
    width: '100%',
    padding: '17px 12px',
    border: 'none',
    background: 'none',
    color: '#007AFF',
    fontSize: '19px',
    fontWeight: 400,
    fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    cursor: 'pointer',
    textAlign: 'center',
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{
        width: '100%',
        maxWidth: '300px',
        backgroundColor: '#F1F1F5',
        borderRadius: '30px',
        overflow: 'hidden',
        fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.3)',
      }}>
        <div style={{ padding: '26px 18px 22px 18px', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: 700, color: '#000000', lineHeight: '1.25' }}>
            &ldquo;Flood Watch&rdquo; Would Like to Access Your Photos
          </h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#000000', lineHeight: '1.35' }}>
            This lets you select photos and videos from your library and attach to your entry.
          </p>
        </div>

        <div style={{ borderTop: '1px solid rgba(0,0,0,0.15)' }} />
        <button type="button" onClick={onSelectPhotos} style={buttonStyle}>
          Select Photos&hellip;
        </button>

        <div style={{ borderTop: '1px solid rgba(0,0,0,0.15)' }} />
        <button type="button" onClick={onAllowAll} style={buttonStyle}>
          Allow Access to all Photos
        </button>

        <div style={{ borderTop: '1px solid rgba(0,0,0,0.15)' }} />
        <button type="button" onClick={onDontAllow} style={{ ...buttonStyle, fontWeight: 600 }}>
          Don&rsquo;t Allow
        </button>
      </div>
    </div>
  );
}
