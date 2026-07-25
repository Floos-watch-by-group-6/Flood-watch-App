import { useState } from 'react';
import floodwatchLogo from '../assets/Floodwatchlogo.svg';
import type { FloodReport } from '../type';
import PostDetailScreen from './PostDetailScreen';
import DeletePostMenu from './DeletePostMenu';
import DeleteReportConfirmModal from './DeleteReportConfirmModal';

export interface FeedPost {
  id: number;
  username: string;
  timeAgo: string;
  locationName: string;
  severity: 'High' | 'Medium' | 'Low';
  status: 'Verified' | 'Unverified';
  description: string;
  images: string[];
  commentCount: number;
  reportedBy?: string;
}

interface FeedScreenProps {
  reports: FloodReport[];
  mainSearchQuery: string;
  setMainSearchQuery: (q: string) => void;
  handleMainSearchSubmit: (e: React.FormEvent) => void;
  currentUser: string;
  onDeleteReport: (id: number) => void;
}

function timeAgo(createdAt: number): string {
  const diffMs = Date.now() - createdAt;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}hr ${diffMins % 60}m ago`;
  return `${Math.floor(diffHrs / 24)}d ago`;
}

function severityLabel(level: 'Low' | 'Medium' | 'High'): string {
  switch (level) {
    case 'High': return 'High Severity';
    case 'Medium': return 'Medium Severity';
    case 'Low': return 'Low Severity';
  }
}

function severityColors(level: 'Low' | 'Medium' | 'High'): { bg: string; text: string } {
  switch (level) {
    case 'High': return { bg: '#FDEBEA', text: '#E5322D' };
    case 'Medium': return { bg: '#FEF0E1', text: '#E07A1A' };
    case 'Low': return { bg: '#E8F6EC', text: '#1F9D57' };
  }
}

// Convert FloodReports to FeedPosts
function toFeedPosts(reports: FloodReport[]): FeedPost[] {
  const SAMPLE_USERNAMES = ['KBSHOGI', 'LekiWatcher', 'FloodAlert', 'AjahReporter', 'VIWatcher'];
  return reports.map((r, i) => ({
    id: r.id,
    username: SAMPLE_USERNAMES[i % SAMPLE_USERNAMES.length],
    timeAgo: timeAgo(r.createdAt),
    locationName: r.locationName,
    severity: r.waterLevel,
    status: r.status,
    description: "Recovery days hit different when the setup is this clean 🌿☀️",
    images: r.images || (r.imageUrl ? [r.imageUrl] : []),
    commentCount: (r.id % 9) + 1,
    reportedBy: r.reportedBy,
  }));
}

// Static sample posts to always have feed content (matching the design)
const SAMPLE_POSTS: FeedPost[] = [
  {
    id: 1001,
    username: 'KBSHOGI',
    timeAgo: '22 min ago',
    locationName: 'Admiralty Way, Lekki Phase 1',
    severity: 'High',
    status: 'Unverified',
    description: 'Recovery days hit different when the setup is this clean 🌿☀️',
    images: [
      'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&q=80',
      'https://images.unsplash.com/photo-1600336153113-d66c79de3e91?w=600&q=80',
    ],
    commentCount: 7,
  },
  {
    id: 1002,
    username: 'KBSHOGI',
    timeAgo: '22 min ago',
    locationName: 'Admiralty Way, Lekki Phase 1',
    severity: 'High',
    status: 'Verified',
    description: 'Recovery days hit different when the setup is this clean 🌿☀️',
    images: [
      'https://images.unsplash.com/photo-1600336153113-d66c79de3e91?w=800&q=80',
    ],
    commentCount: 7,
  },
  {
    id: 1003,
    username: 'KBSHOGI',
    timeAgo: '22 min ago',
    locationName: 'Admiralty Way, Lekki Phase 1',
    severity: 'High',
    status: 'Verified',
    description: 'Recovery days hit different when the setup is this clean 🌿☀️',
    images: [
      'https://images.unsplash.com/photo-1504751823-c0dfea8c2c1e?w=800&q=80',
    ],
    commentCount: 7,
  },
  {
    id: 1004,
    username: 'KBSHOGI',
    timeAgo: '22 min ago',
    locationName: 'Admiralty Way, Lekki Phase 1',
    severity: 'High',
    status: 'Verified',
    description: 'Recovery days hit different when the setup is this clean 🌿☀️',
    images: [],
    commentCount: 7,
  },
];

export default function FeedScreen({
  reports,
  mainSearchQuery,
  setMainSearchQuery,
  handleMainSearchSubmit,
  currentUser,
  onDeleteReport,
}: FeedScreenProps) {
  const [selectedPost, setSelectedPost] = useState<FeedPost | null>(null);
  const [menuPostId, setMenuPostId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // Merge real reports with sample posts (real posts first, most recently reported first)
  const realPosts = toFeedPosts([...reports].sort((a, b) => b.createdAt - a.createdAt));
  const allPosts: FeedPost[] = [...realPosts, ...SAMPLE_POSTS];

  return (
    <>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#F4F5F6',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '"Euclid", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        overflowY: 'auto',
        zIndex: 2,
      }}>
        {/* Header */}
        <div style={{
          position: 'sticky',
          top: 0,
          backgroundColor: '#F4F5F6',
          zIndex: 10,
          padding: '52px 18px 14px 18px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Logo */}
            <div style={{ flexShrink: 0 }}>
              <img
                src={floodwatchLogo}
                alt="Floodwatch"
                width={42}
                height={29}
                style={{ display: 'block' }}
              />
            </div>

            {/* Search Bar */}
            <form onSubmit={handleMainSearchSubmit} style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: '#FFFFFF',
                borderRadius: '999px',
                padding: '15px 20px',
                boxShadow: '0px 6px 16px rgba(17, 24, 39, 0.06)',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F2430" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7.5" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search a street or area"
                  value={mainSearchQuery}
                  onChange={(e) => setMainSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '17px',
                    fontWeight: 600,
                    color: '#1F2430',
                    flex: 1,
                    fontFamily: 'inherit',
                    minWidth: 0,
                  }}
                />
              </div>
            </form>
          </div>
        </div>

        {/* Feed Posts */}
        <div style={{ flex: 1, padding: '6px 14px 140px 14px' }}>
          {allPosts.map((post) => (
            <FeedPostCard
              key={post.id}
              post={post}
              onSelect={() => setSelectedPost(post)}
              isOwnPost={!!post.reportedBy && post.reportedBy === currentUser}
              onOpenMenu={() => setMenuPostId(post.id)}
            />
          ))}
        </div>
      </div>

      {/* Post Detail Overlay */}
      {selectedPost && (
        <PostDetailScreen
          post={selectedPost}
          currentUser={currentUser}
          onBack={() => setSelectedPost(null)}
        />
      )}

      {/* Delete Post action sheet */}
      {menuPostId !== null && (
        <DeletePostMenu
          onClose={() => setMenuPostId(null)}
          onDeletePost={() => {
            setConfirmDeleteId(menuPostId);
            setMenuPostId(null);
          }}
        />
      )}

      {/* Delete confirmation */}
      {confirmDeleteId !== null && (
        <DeleteReportConfirmModal
          onCancel={() => setConfirmDeleteId(null)}
          onConfirm={() => {
            onDeleteReport(confirmDeleteId);
            if (selectedPost?.id === confirmDeleteId) setSelectedPost(null);
            setConfirmDeleteId(null);
          }}
        />
      )}
    </>
  );
}

function FeedPostCard({
  post,
  onSelect,
  isOwnPost,
  onOpenMenu,
}: {
  post: FeedPost;
  onSelect: () => void;
  isOwnPost: boolean;
  onOpenMenu: () => void;
}) {
  const sevColors = severityColors(post.severity);

  return (
    <div
      onClick={onSelect}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '18px 20px',
        marginBottom: '16px',
        boxShadow: '0px 6px 20px rgba(17, 24, 39, 0.05)',
        cursor: 'pointer',
      }}
    >
      {/* Username row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <span style={{ fontSize: '15px', fontWeight: 600, color: '#6E6E76' }}>@{post.username}</span>
          <span style={{ fontSize: '13px', color: '#B0B0B8' }}>•</span>
          <span style={{ fontSize: '15px', color: '#9CA0A8' }}>{post.timeAgo}</span>
        </div>

        {isOwnPost && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onOpenMenu(); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '30px',
              height: '30px',
              flexShrink: 0,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#9CA0A8',
              padding: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>
        )}
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid #EDEEF0', margin: '14px 0' }} />

      {/* Reported at */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px',
        flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>Reported at:</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#1F2430" strokeWidth="1.8" strokeLinejoin="round" />
            <circle cx="12" cy="9" r="2.5" stroke="#1F2430" strokeWidth="1.8" />
          </svg>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>{post.locationName}</span>
        </span>
      </div>

      {/* Severity + Status badges */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <span style={{
          fontSize: '13px',
          fontWeight: 600,
          padding: '5px 12px',
          borderRadius: '999px',
          backgroundColor: sevColors.bg,
          color: sevColors.text,
        }}>
          {severityLabel(post.severity)}
        </span>

        <span style={{
          fontSize: '13px',
          fontWeight: 600,
          padding: '5px 12px',
          borderRadius: '999px',
          backgroundColor: post.status === 'Verified' ? '#DCF3E5' : '#EBECEE',
          color: post.status === 'Verified' ? '#1F9D57' : '#8A8A93',
        }}>
          {post.status}
        </span>
      </div>

      {/* Description */}
      <p style={{
        margin: '0 0 14px 0',
        fontSize: '16px',
        color: '#8E8E96',
        lineHeight: '1.5',
      }}>
        {post.description}
      </p>

      {/* Images */}
      {post.images.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: post.images.length === 1 ? '1fr' : '1fr 1fr',
          gap: '10px',
          marginBottom: '14px',
        }}>
          {post.images.slice(0, 2).map((img, i) => (
            <div key={i} style={{
              borderRadius: '18px',
              overflow: 'hidden',
              aspectRatio: post.images.length === 1 ? '16 / 10' : '3 / 4',
              backgroundColor: '#EDEEF0',
            }}>
              <img
                src={img}
                alt={`flood ${i + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      {/* Comment chip */}
      <div>
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            backgroundColor: '#F1F1F3',
            border: 'none',
            borderRadius: '14px',
            padding: '8px 14px',
            cursor: 'pointer',
            color: '#4B4B57',
            fontSize: '15px',
            fontWeight: 500,
            fontFamily: 'inherit',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4B4B57" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          {post.commentCount}
        </button>
      </div>
    </div>
  );
}
