interface DeletePostMenuProps {
  onDeletePost: () => void;
  onClose: () => void;
}

export default function DeletePostMenu({ onDeletePost, onClose }: DeletePostMenuProps) {
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
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          fontFamily: '"Euclid", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          boxShadow: '0px -10px 40px rgba(0, 0, 0, 0.25)',
          animation: 'sheetSlideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1) both',
          paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
        }}
      >
        {/* Grabber */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0' }}>
          <div style={{ width: '40px', height: '5px', borderRadius: '3px', backgroundColor: '#D5D7DB' }} />
        </div>

        <div style={{ borderTop: '1px solid #EDEEF0' }} />

        <button
          type="button"
          onClick={onDeletePost}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            width: '100%',
            padding: '20px 24px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M4 7h16" stroke="#FD5F53" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" stroke="#FD5F53" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 7l1 12.5A1.5 1.5 0 0 0 8.5 21h7a1.5 1.5 0 0 0 1.5-1.5L18 7" stroke="#FD5F53" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 11.5h4M10.3 15h3.4" stroke="#FD5F53" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: '17px', fontWeight: 600, color: '#FD5F53' }}>Delete Post</span>
        </button>
      </div>
    </div>
  );
}
