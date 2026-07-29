import { useMemo, useState } from 'react';
import floodwatchLogo from '../assets/Floodwatchlogo.svg';
import type { FloodReport, FloodConfirmAlert } from '../type';

// Read/unread state is persisted per-account so "Mark all read" survives a
// refresh or signing in again, instead of resetting to hardcoded demo data.
function readAlertIdsKey(): string {
  const userId = localStorage.getItem('userId');
  return userId ? `floodwatch_read_alerts_${userId}` : 'floodwatch_read_alerts_anonymous';
}

function loadReadAlertIds(): Set<number> {
  try {
    const raw = localStorage.getItem(readAlertIdsKey());
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveReadAlertIds(ids: Set<number>) {
  localStorage.setItem(readAlertIdsKey(), JSON.stringify(Array.from(ids)));
}

function WarningIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.29 3.86L1.82 18a1 1 0 0 0 .86 1.5h18.64a1 1 0 0 0 .86-1.5L13.71 3.86a1 1 0 0 0-1.72 0z" stroke="#EF4444" strokeWidth="1.8" strokeLinejoin="round" />
      <line x1="12" y1="9" x2="12" y2="13" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16.3" r="1" fill="#EF4444" />
    </svg>
  );
}

function ConfirmedIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="#16A34A" strokeWidth="1.8" />
      <path d="M7 12.5l3.5 3.5L17 8" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 6l6 6-6 6" stroke="#C4C9D1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDown({ collapsed }: { collapsed?: boolean }) {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.22s ease', flexShrink: 0 }}
    >
      <path d="M6 9l6 6 6-6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function OwnVerifiedRow({ alert, unread, onMarkRead, onOpen }: { alert: FloodConfirmAlert; unread: boolean; onMarkRead: (id: string) => void; onOpen?: () => void }) {
  return (
    <div
      onClick={() => { onMarkRead(alert.backendId); onOpen?.(); }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: unread ? '#FFFBEB' : '#FFFFFF',
        border: '1px solid #EFEFEF',
        borderRadius: '20px',
        padding: '14px',
        marginBottom: '14px',
        cursor: 'pointer',
      }}
    >
      {unread && (
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#F59E0B', flexShrink: 0 }} />
      )}
      <div style={{
        width: '38px', height: '38px', borderRadius: '50%',
        backgroundColor: '#FEF3C7',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" stroke="#F59E0B" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ flex: '1 1 auto', minWidth: 0 }}>
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#111827' }}>Your report has been verified</span>
        <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: '#9CA3AF', lineHeight: '1.4' }}>
          {alert.locationName} · confirmed by 3 users
        </p>
      </div>
      <ChevronRight />
    </div>
  );
}

function ConfirmAlertRow({ alert, unread, onMarkRead, onOpen }: { alert: FloodConfirmAlert; unread: boolean; onMarkRead: (id: string) => void; onOpen?: () => void }) {
  return (
    <div
      onClick={() => { onMarkRead(alert.backendId); onOpen?.(); }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: unread ? '#ECFDF5' : '#FFFFFF',
        border: '1px solid #EFEFEF',
        borderRadius: '20px',
        padding: '14px',
        marginBottom: '14px',
        cursor: 'pointer',
      }}
    >
      {unread && (
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16A34A', flexShrink: 0 }} />
      )}
      <div style={{
        width: '38px', height: '38px', borderRadius: '50%',
        backgroundColor: '#DCFCE7',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <ConfirmedIcon />
      </div>
      <div style={{ flex: '1 1 auto', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
            Flood confirmed near you
          </span>
        </div>
        <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: '#9CA3AF', lineHeight: '1.4' }}>
          {alert.locationName}, {alert.waterLevel} severity · verified by community
        </p>
      </div>
      <ChevronRight />
    </div>
  );
}

function AlertRow({ report, unread, onOpen }: { report: FloodReport; unread: boolean; onOpen: (report: FloodReport) => void }) {
  return (
    <div
      onClick={() => onOpen(report)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: unread ? '#E7F0FA' : '#FFFFFF',
        border: '1px solid #EFEFEF',
        boxShadow: 'none',
        borderRadius: '20px',
        padding: '14px',
        marginBottom: '14px',
        cursor: 'pointer',
      }}
    >
      {unread && (
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0F2A4A', flexShrink: 0 }} />
      )}

      <div style={{
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        backgroundColor: '#FCE3E1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <WarningIcon />
      </div>

      <div style={{ flex: '1 1 auto', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>New flood report nearby</span>
          <span style={{ fontSize: '10.5px', color: '#9CA3AF', flexShrink: 0 }}>•</span>
          <span style={{ fontSize: '10.5px', color: '#9CA3AF', flexShrink: 0 }}>{report.timeActive}</span>
        </div>
        <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: '#9CA3AF', lineHeight: '1.4' }}>
          {report.locationName}, {report.waterLevel} severity
        </p>
      </div>

      <ChevronRight />
    </div>
  );
}

interface AlertsScreenProps {
  reports: FloodReport[];
  currentUser: string;
  onOpenReport: (report: FloodReport) => void;
}

type AlertEntry =
  | { kind: 'report'; report: FloodReport; sortKey: number }
  | { kind: 'confirmed'; alert: FloodConfirmAlert; sortKey: number };

export default function AlertsScreen({ reports, currentUser, onOpenReport }: AlertsScreenProps) {
  const [readIds, setReadIds] = useState<Set<number>>(() => loadReadAlertIds());
  const [readConfirmIds, setReadConfirmIds] = useState<Set<string>>(() => {
    try {
      const key = `floodwatch_read_confirm_${localStorage.getItem('userId') || 'anon'}`;
      const raw = localStorage.getItem(key);
      return raw ? new Set(JSON.parse(raw)) : new Set<string>();
    } catch { return new Set<string>(); }
  });
  const [collapsed, setCollapsed] = useState<{ Today: boolean; Yesterday: boolean; Earlier: boolean }>({
    Today: false, Yesterday: false, Earlier: false,
  });

  const reportsByBackendId = useMemo(() => {
    const map = new Map<string, FloodReport>();
    for (const r of reports) {
      if (r.backendId) map.set(r.backendId, r);
    }
    return map;
  }, [reports]);

  // Derive confirmation alerts directly from reports state — every verified
  // backend report becomes an alert automatically as soon as the poll updates
  // its status, with no separate detection or session-lifetime constraint.
  const verifiedAlerts = useMemo((): FloodConfirmAlert[] =>
    reports
      .filter(r => r.status === 'Verified' && r.backendId)
      .map(r => ({
        backendId: r.backendId!,
        reportId: r.id,
        locationName: r.locationName,
        waterLevel: r.waterLevel,
        confirmedAt: r.createdAt + 1,
        kind: (r.reportedBy === currentUser ? 'own_verified' : 'confirmed') as 'own_verified' | 'confirmed',
      })),
    [reports, currentUser]
  );

  const alertReports = useMemo(
    () => reports.filter(r => r.reportedBy !== currentUser),
    [reports, currentUser]
  );

  const allEntries = useMemo((): AlertEntry[] => {
    const entries: AlertEntry[] = [
      ...alertReports.map(r => ({ kind: 'report' as const, report: r, sortKey: r.createdAt })),
      ...verifiedAlerts.map(a => ({ kind: 'confirmed' as const, alert: a, sortKey: a.confirmedAt })),
    ];
    return entries.sort((a, b) => b.sortKey - a.sortKey);
  }, [alertReports, verifiedAlerts]);

  const hasUnread =
    alertReports.some(r => !readIds.has(r.id)) ||
    verifiedAlerts.some(a => !readConfirmIds.has(a.backendId));

  const markReportRead = (id: number) => {
    setReadIds(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      saveReadAlertIds(next);
      return next;
    });
  };

  const markConfirmRead = (backendId: string) => {
    setReadConfirmIds(prev => {
      if (prev.has(backendId)) return prev;
      const next = new Set(prev);
      next.add(backendId);
      const key = `floodwatch_read_confirm_${localStorage.getItem('userId') || 'anon'}`;
      localStorage.setItem(key, JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const markAllRead = () => {
    setReadIds(prev => {
      const next = new Set(prev);
      alertReports.forEach(r => next.add(r.id));
      saveReadAlertIds(next);
      return next;
    });
    setReadConfirmIds(prev => {
      const next = new Set(prev);
      verifiedAlerts.forEach(a => next.add(a.backendId));
      const key = `floodwatch_read_confirm_${localStorage.getItem('userId') || 'anon'}`;
      localStorage.setItem(key, JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const toggleSection = (section: 'Today' | 'Yesterday' | 'Earlier') =>
    setCollapsed(c => ({ ...c, [section]: !c[section] }));

  const openReport = (report: FloodReport) => {
    markReportRead(report.id);
    onOpenReport(report);
  };

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;

  const todayEntries = allEntries.filter(e => e.sortKey >= startOfToday);
  const yesterdayEntries = allEntries.filter(e => e.sortKey >= startOfYesterday && e.sortKey < startOfToday);
  const earlierEntries = allEntries.filter(e => e.sortKey < startOfYesterday);

  const sections: { key: 'Today' | 'Yesterday' | 'Earlier'; label: string; items: AlertEntry[] }[] = [
    { key: 'Today', label: 'Today', items: todayEntries },
    { key: 'Yesterday', label: 'Yesterday', items: yesterdayEntries },
    { key: 'Earlier', label: 'Earlier', items: earlierEntries },
  ];

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      overflowY: 'auto',
      zIndex: 2,
    }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        backgroundColor: '#FFFFFF',
        zIndex: 10,
        padding: '52px 16px 20px 16px',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
      }}>
        <img
          src={floodwatchLogo}
          alt="Floodwatch"
          width={32}
          height={32}
          style={{ display: 'block', justifySelf: 'start' }}
        />
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#111827', textAlign: 'center' }}>Alerts</h1>
        <button
          onClick={markAllRead}
          disabled={!hasUnread}
          style={{
            justifySelf: 'end',
            border: 'none',
            background: 'none',
            padding: 0,
            fontSize: '13px',
            fontWeight: '600',
            color: hasUnread ? '#111827' : '#C4C9D1',
            cursor: hasUnread ? 'pointer' : 'default',
            transition: 'color 0.2s ease',
            whiteSpace: 'nowrap',
          }}
        >
          Mark all read
        </button>
      </div>

      {/* Alerts List */}
      <div style={{ flex: 1, padding: '4px 16px 140px 16px' }}>
        {allEntries.length === 0 && (
          <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '14px', marginTop: '48px', lineHeight: '1.5' }}>
            No alerts yet.<br />You'll see one here when someone reports flooding.
          </p>
        )}

        {sections.map(({ key, label, items }) => items.length > 0 && (
          <div key={key}>
            <div
              onClick={() => toggleSection(key)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '8px 0 16px 0', cursor: 'pointer', userSelect: 'none' }}
            >
              <span style={{ fontSize: '18px', fontWeight: '500', color: '#9CA3AF' }}>{label}</span>
              <ChevronDown collapsed={collapsed[key]} />
            </div>
            {!collapsed[key] && items.map(entry => {
              if (entry.kind === 'confirmed') {
                const sourceReport = reportsByBackendId.get(entry.alert.backendId);
                const handleOpen = sourceReport ? () => onOpenReport(sourceReport) : undefined;
                return entry.alert.kind === 'own_verified' ? (
                  <OwnVerifiedRow
                    key={`v-${entry.alert.backendId}`}
                    alert={entry.alert}
                    unread={!readConfirmIds.has(entry.alert.backendId)}
                    onMarkRead={markConfirmRead}
                    onOpen={handleOpen}
                  />
                ) : (
                  <ConfirmAlertRow
                    key={`c-${entry.alert.backendId}`}
                    alert={entry.alert}
                    unread={!readConfirmIds.has(entry.alert.backendId)}
                    onMarkRead={markConfirmRead}
                    onOpen={handleOpen}
                  />
                );
              }
              return (
                <AlertRow
                  key={`r-${entry.report.id}`}
                  report={entry.report}
                  unread={!readIds.has(entry.report.id)}
                  onOpen={openReport}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
