interface DeleteReportConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteReportConfirmModal({ onConfirm, onCancel }: DeleteReportConfirmModalProps) {
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
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '340px',
          backgroundColor: '#F3F4F6',
          borderRadius: '24px',
          padding: '28px 24px',
          fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.25)',
        }}
      >
        <h2 style={{ margin: '0 0 14px 0', fontSize: '22px', fontWeight: 700, color: '#1F2430' }}>
          Delete report?
        </h2>

        <p style={{ margin: '0 0 24px 0', fontSize: '16px', color: '#7A7A85', lineHeight: '1.5' }}>
          This can't be undone. It will be removed from the map, the Feed, and won't count toward verification confirmations.
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '24px' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '17px',
              fontWeight: 600,
              color: '#4B4B57',
              padding: 0,
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '17px',
              fontWeight: 700,
              color: '#1F2430',
              padding: 0,
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
