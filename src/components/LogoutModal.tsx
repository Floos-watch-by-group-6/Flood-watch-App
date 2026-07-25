interface LogoutModalProps {
  onLogout: () => void;
  onCancel: () => void;
}

export default function LogoutModal({ onLogout, onCancel }: LogoutModalProps) {
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
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: '32px',
          borderTopRightRadius: '32px',
          padding: '14px 24px max(28px, env(safe-area-inset-bottom)) 24px',
          fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          boxShadow: '0px -10px 40px rgba(0, 0, 0, 0.25)',
          animation: 'sheetSlideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1) both',
        }}
      >
        {/* Grabber */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{ width: '40px', height: '5px', borderRadius: '3px', backgroundColor: '#C4C9D1' }} />
        </div>

        {/* Log out icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            backgroundColor: '#FEECEA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H6a2 2 0 01-2-2V5a2 2 0 012-2h3" stroke="#FD5F53" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 17l5-5-5-5M21 12H9" stroke="#FD5F53" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <h2 style={{ margin: '0 0 14px 0', fontSize: '22px', fontWeight: 700, color: '#3A3A44', textAlign: 'center', letterSpacing: '-0.01em' }}>
          Log out of FloodWatch?
        </h2>

        <p style={{ margin: '0 0 30px 0', fontSize: '16px', color: '#7A7A85', textAlign: 'center', lineHeight: '1.5' }}>
          You'll need your username and password to log back in.
        </p>

        <button
          type="button"
          onClick={onLogout}
          style={{
            width: '100%',
            padding: '18px',
            borderRadius: '999px',
            backgroundColor: '#FD5F53',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '17px',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: '14px',
            fontFamily: 'inherit',
          }}
        >
          Log out
        </button>

        <button
          type="button"
          onClick={onCancel}
          style={{
            width: '100%',
            padding: '18px',
            borderRadius: '999px',
            backgroundColor: '#FFFFFF',
            color: '#1F2430',
            border: '1.5px solid #E5E7EB',
            fontSize: '17px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
