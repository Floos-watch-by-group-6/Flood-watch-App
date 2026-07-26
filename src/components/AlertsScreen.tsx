import { useMemo, useState } from 'react';
import floodwatchLogo from '../assets/Floodwatchlogo.svg';
import type { FloodReport } from '../type';

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

export default function AlertsScreen({ reports, currentUser, onOpenReport }: AlertsScreenProps) {
  const [readIds, setReadIds] = useState<Set<number>>(() => loadReadAlertIds());
  const [collapsed, setCollapsed] = useState<{ Today: boolean; Yesterday: boolean; Earlier: boolean }>({
    Today: false, Yesterday: false, Earlier: false,
  });

  // Only real reports from other users become alerts — you don't need to be
  // alerted about your own report.
  const alertReports = useMemo(
    () => reports.filter(r => r.reportedBy !== currentUser).sort((a, b) => b.createdAt - a.createdAt),
    [reports, currentUser]
  );

  const hasUnread = alertReports.some(r => !readIds.has(r.id));

  const markAsRead = (id: number) => {
    setReadIds(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      saveReadAlertIds(next);
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
  };

  const toggleSection = (section: 'Today' | 'Yesterday' | 'Earlier') =>
    setCollapsed(c => ({ ...c, [section]: !c[section] }));

  const openReport = (report: FloodReport) => {
    markAsRead(report.id);
    onOpenReport(report);
  };

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;

  const todayReports = alertReports.filter(r => r.createdAt >= startOfToday);
  const yesterdayReports = alertReports.filter(r => r.createdAt >= startOfYesterday && r.createdAt < startOfToday);
  const earlierReports = alertReports.filter(r => r.createdAt < startOfYesterday);

  const sections: { key: 'Today' | 'Yesterday' | 'Earlier'; label: string; items: FloodReport[] }[] = [
    { key: 'Today', label: 'Today', items: todayReports },
    { key: 'Yesterday', label: 'Yesterday', items: yesterdayReports },
    { key: 'Earlier', label: 'Earlier', items: earlierReports },
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
        {alertReports.length === 0 && (
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
            {!collapsed[key] && items.map(report => (
              <AlertRow key={report.id} report={report} unread={!readIds.has(report.id)} onOpen={openReport} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
