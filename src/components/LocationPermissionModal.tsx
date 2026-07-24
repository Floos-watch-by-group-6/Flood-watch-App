import type { CSSProperties } from 'react';

interface LocationPermissionModalProps {
  onAllowOnce: () => void;
  onAllowWhileUsing: () => void;
  onDontAllow: () => void;
}

export default function LocationPermissionModal({ onAllowOnce, onAllowWhileUsing, onDontAllow }: LocationPermissionModalProps) {
  const buttonStyle: CSSProperties = {
    width: '100%',
    padding: '17px 12px',
    border: 'none',
    background: 'none',
    color: '#007AFF',
    fontSize: '19px',
    fontWeight: 400,
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
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      <div style={{
        width: '100%',
        backgroundColor: '#F1F1F5',
        borderTopLeftRadius: '32px',
        borderTopRightRadius: '32px',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        boxShadow: '0px -10px 40px rgba(0, 0, 0, 0.3)',
      }}>
        <div style={{ padding: '34px 22px 18px 22px', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 12px 0', fontSize: '21px', fontWeight: 700, color: '#000000', lineHeight: '1.25' }}>
            Allow &ldquo;Flood Watch&rdquo; to use your location?
          </h2>
          <p style={{ margin: 0, fontSize: '15px', color: '#000000', lineHeight: '1.35' }}>
            Turning on location services allows us to show you when pals are nearby.
          </p>
        </div>

        <div style={{ position: 'relative', height: '250px', backgroundColor: '#C9DFAD', overflow: 'hidden' }}>
          <svg width="100%" height="100%" viewBox="0 0 400 250" style={{ position: 'absolute', inset: 0 }}>
            <path d="M-10 90 L120 60 L260 130 L410 40" stroke="#B7CE9A" strokeWidth="3" fill="none" />
            <path d="M-10 190 L150 205 L230 150 L300 235 L410 170" stroke="#B7CE9A" strokeWidth="3" fill="none" />
            <path d="M60 -10 L180 260" stroke="#B7CE9A" strokeWidth="3" fill="none" />
            <path d="M330 -10 L260 260" stroke="#B7CE9A" strokeWidth="3" fill="none" />
          </svg>

          <div style={{
            position: 'absolute', top: '16px', left: '16px', backgroundColor: '#FFFFFF', borderRadius: '999px',
            padding: '9px 16px', display: 'flex', alignItems: 'center', gap: '7px', boxShadow: '0px 2px 8px rgba(0,0,0,0.15)',
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#007AFF">
              <path d="M3 11.5L20 3l-8.5 17-2-6.5-6.5-2z" />
            </svg>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#007AFF' }}>Precise: On</span>
          </div>

          <span style={{ position: 'absolute', top: '68px', left: '48px', fontSize: '13px', color: '#3A3A3A', fontWeight: 500 }}>
            Maladzyechna
          </span>
          <span style={{ position: 'absolute', top: '108px', left: '210px', fontSize: '13px', color: '#3A3A3A', fontWeight: 500 }}>
            Barysaw
          </span>
          <span style={{
            position: 'absolute', bottom: '14px', left: '50%', transform: 'translateX(-50%)',
            fontSize: '22px', fontWeight: 800, color: '#A16158', letterSpacing: '1px',
          }}>
            BELARUS
          </span>

          <div style={{
            position: 'absolute', top: '50%', left: '54%', transform: 'translate(-50%, -50%)',
            width: '150px', height: '150px', borderRadius: '50%', border: '7px solid #FFFFFF',
            backgroundColor: 'rgba(120, 170, 110, 0.4)', boxShadow: '0px 4px 16px rgba(0,0,0,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: '9px', height: '9px', borderRadius: '50%', border: '2.5px solid #1F2430', backgroundColor: 'transparent' }} />
          </div>
          <span style={{
            position: 'absolute', top: '50%', left: '54%', transform: 'translate(-50%, 14px)',
            fontSize: '19px', fontWeight: 700, color: '#1F2430',
          }}>
            Minsk
          </span>
        </div>

        <div style={{ borderTop: '1px solid rgba(0,0,0,0.15)' }} />
        <button type="button" onClick={onAllowOnce} style={buttonStyle}>
          Allow Once
        </button>

        <div style={{ borderTop: '1px solid rgba(0,0,0,0.15)' }} />
        <button type="button" onClick={onAllowWhileUsing} style={buttonStyle}>
          Allow While Using App
        </button>

        <div style={{ borderTop: '1px solid rgba(0,0,0,0.15)' }} />
        <button type="button" onClick={onDontAllow} style={buttonStyle}>
          Don&rsquo;t Allow
        </button>
      </div>
    </div>
  );
}
