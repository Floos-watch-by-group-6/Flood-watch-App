import type { CSSProperties } from 'react';

interface NotificationPermissionModalProps {
  onDontAllow: () => void;
  onOk: () => void;
}

export default function NotificationPermissionModal({ onDontAllow, onOk }: NotificationPermissionModalProps) {
  const buttonBase: CSSProperties = {
    flex: 1,
    padding: '17px 12px',
    border: 'none',
    background: 'none',
    color: '#007AFF',
    fontSize: '19px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
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
        borderRadius: '20px',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.3)',
      }}>
        <div style={{ padding: '26px 20px 22px 20px', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 700, color: '#000000', lineHeight: '1.25' }}>
            &ldquo;Flood Watch&rdquo; Would Like to Send You Push Notifications
          </h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#000000', lineHeight: '1.35' }}>
            Notifications may include alerts, sounds and icon badges. These can be configured in Settings
          </p>
        </div>

        <div style={{ borderTop: '1px solid rgba(0,0,0,0.15)', display: 'flex' }}>
          <button
            type="button"
            onClick={onDontAllow}
            style={{ ...buttonBase, fontWeight: 400, borderRight: '1px solid rgba(0,0,0,0.15)' }}
          >
            Don&rsquo;t Allow
          </button>
          <button
            type="button"
            onClick={onOk}
            style={{ ...buttonBase, fontWeight: 700 }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
