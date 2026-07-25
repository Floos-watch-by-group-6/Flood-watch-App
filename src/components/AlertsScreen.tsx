import { useState } from 'react';
import floodwatchLogo from '../assets/Floodwatchlogo.svg';
import type { FloodReport } from '../type';

type AlertKind = 'warning' | 'rain' | 'verified' | 'resolved';

interface AlertItemData {
  id: number;
  section: 'Today' | 'Yesterday';
  kind: AlertKind;
  title: string;
  time: string;
  description: string;
  unread: boolean;
  reportLocation?: string;
}

const INITIAL_ALERTS: AlertItemData[] = [
  {
    id: 1,
    section: 'Today',
    kind: 'warning',
    title: 'Flooding confirmed near you',
    time: '22 min ago',
    description: 'Admiralty Way, Lekki Phase 1, Medium severity, 4 confirmations',
    unread: true,
    reportLocation: 'Admiralty Way',
  },
  {
    id: 2,
    section: 'Today',
    kind: 'rain',
    title: 'Heavy rain in your area',
    time: '9:00 PM',
    description: 'Seen any flooding? Tap to report what you see',
    unread: true,
  },
  {
    id: 3,
    section: 'Today',
    kind: 'verified',
    title: 'Report now Verified',
    time: '9:00 PM',
    description: 'Igbo-Efon Road reached 3 confirmations',
    unread: false,
  },
  {
    id: 4,
    section: 'Yesterday',
    kind: 'warning',
    title: 'New flood report nearby',
    time: '22 min ago',
    description: 'Chevron Drive, Medium severity',
    unread: false,
    reportLocation: 'Chevron Drive',
  },
  {
    id: 5,
    section: 'Yesterday',
    kind: 'resolved',
    title: 'Freedom Way "Likely Resolved"',
    time: '9:00 PM',
    description: 'No new confirmations in the last 2 hours',
    unread: false,
  },
];

function AlertIcon({ kind }: { kind: AlertKind }) {
  switch (kind) {
    case 'warning':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.29 3.86L1.82 18a1 1 0 0 0 .86 1.5h18.64a1 1 0 0 0 .86-1.5L13.71 3.86a1 1 0 0 0-1.72 0z" stroke="#EF4444" strokeWidth="1.8" strokeLinejoin="round" />
          <line x1="12" y1="9" x2="12" y2="13" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="12" cy="16.3" r="1" fill="#EF4444" />
        </svg>
      );
    case 'rain':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.4776 10.0001C17.485 10 17.4925 10 17.5 10C19.9853 10 22 12.0147 22 14.5C22 16.9853 19.9853 19 17.5 19H7C4.23858 19 2 16.7614 2 14C2 11.4003 3.98398 9.26407 6.52042 9.0227M17.4776 10.0001C17.4924 9.83536 17.5 9.66856 17.5 9.5C17.5 6.46243 15.0376 4 12 4C9.12324 4 6.76233 6.20862 6.52042 9.0227M17.4776 10.0001C17.3753 11.1345 16.9286 12.1696 16.2428 13M6.52042 9.0227C6.67826 9.00768 6.83823 9 7 9C8.12582 9 9.16474 9.37209 10.0005 10" stroke="#334155" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'verified':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12.5l4.5 4.5L19 7" stroke="#16A34A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'resolved':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="#8B93A1" strokeWidth="1.6" />
          <path d="M8.5 12.3l2.4 2.4 4.6-4.6" stroke="#8B93A1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

function iconBg(kind: AlertKind): string {
  switch (kind) {
    case 'warning': return '#FCE3E1';
    case 'rain': return '#DCE4EE';
    case 'verified': return '#D3F3E1';
    case 'resolved': return '#E8E9EC';
  }
}

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 6l6 6-6 6" stroke="#C4C9D1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9l6 6 6-6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertRow({ item, onRead, onOpenReport }: { item: AlertItemData; onRead: (id: number) => void; onOpenReport?: (locationName: string) => void }) {
  return (
    <div
      onClick={() => {
        if (item.unread) onRead(item.id);
        if (item.reportLocation) onOpenReport?.(item.reportLocation);
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: item.unread ? '#E7F0FA' : '#FFFFFF',
        border: '1px solid #EFEFEF',
        boxShadow: 'none',
        borderRadius: '20px',
        padding: '14px',
        marginBottom: '14px',
        cursor: item.unread || item.reportLocation ? 'pointer' : 'default',
      }}
    >
      {item.unread && (
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0F2A4A', flexShrink: 0 }} />
      )}

      <div style={{
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        backgroundColor: iconBg(item.kind),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <AlertIcon kind={item.kind} />
      </div>

      <div style={{ flex: '1 1 auto', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{item.title}</span>
          <span style={{ fontSize: '10.5px', color: '#9CA3AF', flexShrink: 0 }}>•</span>
          <span style={{ fontSize: '10.5px', color: '#9CA3AF', flexShrink: 0 }}>{item.time}</span>
        </div>
        <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: '#9CA3AF', lineHeight: '1.4' }}>
          {item.description}
        </p>
      </div>

      <ChevronRight />
    </div>
  );
}

interface AlertsScreenProps {
  reports: FloodReport[];
  onOpenReport: (report: FloodReport) => void;
}

export default function AlertsScreen({ reports, onOpenReport }: AlertsScreenProps) {
  const [alerts, setAlerts] = useState<AlertItemData[]>(INITIAL_ALERTS);

  const markAsRead = (id: number) => {
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, unread: false } : a)));
  };

  const markAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, unread: false })));
  };

  const openReportByLocation = (locationName: string) => {
    const report = reports.find(r => r.locationName === locationName);
    if (report) onOpenReport(report);
  };

  const todayAlerts = alerts.filter(a => a.section === 'Today');
  const yesterdayAlerts = alerts.filter(a => a.section === 'Yesterday');

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#F6F7F8',
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <img
          src={floodwatchLogo}
          alt="Floodwatch"
          width={32}
          height={32}
          style={{ display: 'block' }}
        />
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#111827' }}>Alerts</h1>
        <button
          onClick={markAllRead}
          style={{
            border: 'none',
            background: 'none',
            padding: 0,
            fontSize: '13px',
            fontWeight: '600',
            color: '#111827',
            cursor: 'pointer',
          }}
        >
          Mark all read
        </button>
      </div>

      {/* Alerts List */}
      <div style={{ flex: 1, padding: '4px 16px 140px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '8px 0 16px 0' }}>
          <span style={{ fontSize: '18px', fontWeight: '500', color: '#9CA3AF' }}>Today</span>
          <ChevronDown />
        </div>
        {todayAlerts.map(item => (
          <AlertRow key={item.id} item={item} onRead={markAsRead} onOpenReport={openReportByLocation} />
        ))}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '24px 0 16px 0' }}>
          <span style={{ fontSize: '18px', fontWeight: '500', color: '#9CA3AF' }}>Yesterday</span>
          <ChevronDown />
        </div>
        {yesterdayAlerts.map(item => (
          <AlertRow key={item.id} item={item} onRead={markAsRead} onOpenReport={openReportByLocation} />
        ))}
      </div>
    </div>
  );
}
