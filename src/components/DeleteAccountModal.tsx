interface DeleteAccountModalProps {
  onDelete: () => void;
  onKeep: () => void;
}

export default function DeleteAccountModal({ onDelete, onKeep }: DeleteAccountModalProps) {
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
      onClick={onKeep}
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

        {/* Trash icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
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
              <path d="M4 7h16" stroke="#FD5F53" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" stroke="#FD5F53" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 7l1 12.5A1.5 1.5 0 0 0 8.5 21h7a1.5 1.5 0 0 0 1.5-1.5L18 7" stroke="#FD5F53" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 11.5h4M10.3 15h3.4" stroke="#FD5F53" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <h2 style={{ margin: '0 0 20px 0', fontSize: '26px', fontWeight: 700, color: '#3A3A44', textAlign: 'center', letterSpacing: '-0.01em' }}>
          This can&rsquo;t be undone
        </h2>

        <p style={{ margin: '0 0 34px 0', fontSize: '18px', color: '#7A7A85', textAlign: 'center', lineHeight: '1.5' }}>
          Deleting your account is permanent. Here's what happens.
        </p>

        <button
          type="button"
          onClick={onDelete}
          style={{
            width: '100%',
            padding: '19px',
            borderRadius: '999px',
            backgroundColor: '#FD5F53',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '18px',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: '14px',
            fontFamily: 'inherit',
          }}
        >
          Delete account
        </button>

        <button
          type="button"
          onClick={onKeep}
          style={{
            width: '100%',
            padding: '19px',
            borderRadius: '999px',
            backgroundColor: '#FFFFFF',
            color: '#1F2430',
            border: '1.5px solid #E5E7EB',
            fontSize: '18px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Keep my account
        </button>
      </div>
    </div>
  );
}
