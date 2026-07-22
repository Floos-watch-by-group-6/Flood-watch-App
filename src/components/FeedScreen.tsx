import { useState } from 'react';
import type { FloodReport } from '../type';
import PostDetailScreen from './PostDetailScreen';

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
}

interface FeedScreenProps {
  reports: FloodReport[];
  mainSearchQuery: string;
  setMainSearchQuery: (q: string) => void;
  handleMainSearchSubmit: (e: React.FormEvent) => void;
  currentUser: string;
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
    case 'Medium': return 'Med Severity';
    case 'Low': return 'Low Severity';
  }
}

function severityColors(level: 'Low' | 'Medium' | 'High'): { bg: string; text: string } {
  switch (level) {
    case 'High': return { bg: '#FDECEA', text: '#C62828' };
    case 'Medium': return { bg: '#FFF3E0', text: '#E65100' };
    case 'Low': return { bg: '#FFFDE7', text: '#F57F17' };
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
    description: "Recovery days hit different when the setup is this clean 🌿😄",
    images: r.images || (r.imageUrl ? [r.imageUrl] : []),
    commentCount: (r.id % 9) + 1,
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
    description: 'Recovery days hit different when the setup is this clean 🌿😄',
    images: [
      'https://images.unsplash.com/photo-1604357209793-fca5dca89f97?w=400&q=80',
      'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400&q=80',
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
    description: 'Recovery days hit different when the setup is this clean 🌿😄',
    images: [
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=700&q=80',
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
    description: 'Recovery days hit different when the setup is this clean 🌿😄',
    images: [
      'https://images.unsplash.com/photo-1504751823-c0dfea8c2c1e?w=700&q=80',
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
    description: 'Recovery days hit different when the setup is this clean 🌿😄',
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
}: FeedScreenProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedPost, setSelectedPost] = useState<FeedPost | null>(null);

  // Merge real reports with sample posts (real posts first)
  const realPosts = toFeedPosts(reports);
  const allPosts: FeedPost[] = [...realPosts, ...SAMPLE_POSTS];

  return (
    <>
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#FFFFFF',
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
        backgroundColor: '#FFFFFF',
        zIndex: 10,
        padding: '52px 16px 12px 16px',
        borderBottom: '1px solid #F3F4F6',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Logo */}
          <div style={{ flexShrink: 0 }}>
            <img
              src="/src/assets/Floodwatchlogo.svg"
              alt="Floodwatch"
              width={36}
              height={36}
              style={{ display: 'block' }}
            />
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleMainSearchSubmit}
            style={{ flex: 1 }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#F5F5F5',
              borderRadius: '50px',
              padding: '9px 16px',
              border: searchFocused ? '1.5px solid #003366' : '1.5px solid transparent',
              transition: 'border-color 0.2s',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search a street or area"
                value={mainSearchQuery}
                onChange={(e) => setMainSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '14px',
                  color: '#111827',
                  flex: 1,
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </form>
        </div>
      </div>

      {/* Feed Posts */}
      <div style={{ flex: 1, padding: '0 0 140px 0' }}>
        {allPosts.map((post) => (
          <FeedPostCard key={post.id} post={post} onSelect={() => setSelectedPost(post)} />
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
  </>
  );
}

function FeedPostCard({ post, onSelect }: { post: FeedPost; onSelect: () => void }) {
  const sevColors = severityColors(post.severity);
  const [liked, setLiked] = useState(false);

  return (
    <div
      onClick={onSelect}
      style={{
        padding: '16px 16px 0 16px',
        borderBottom: '1px solid #F3F4F6',
        cursor: 'pointer',
      }}
    >
      {/* User row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
        {/* Avatar */}
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #003366 0%, #1a5fa8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '10px',
          fontWeight: '700',
          flexShrink: 0,
        }}>
          {post.username.slice(0, 2).toUpperCase()}
        </div>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#111827' }}>@{post.username}</span>
        <span style={{ fontSize: '11px', color: '#9CA3AF' }}>•</span>
        <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{post.timeAgo}</span>
      </div>

      {/* Reported at */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        marginBottom: '8px',
        fontSize: '12px',
        color: '#374151',
        fontWeight: '500',
      }}>
        <span style={{ color: '#6B7280', fontWeight: '400' }}>Reported at:</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="#EF4444" style={{ flexShrink: 0 }}>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
        <span style={{ fontWeight: '500', color: '#111827' }}>{post.locationName}</span>
      </div>

      {/* Severity + Status badges */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
        <span style={{
          fontSize: '10px',
          fontWeight: '600',
          padding: '3px 10px',
          borderRadius: '20px',
          backgroundColor: sevColors.bg,
          color: sevColors.text,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <span style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            backgroundColor: sevColors.text,
            display: 'inline-block',
          }} />
          {severityLabel(post.severity)}
        </span>

        <span style={{
          fontSize: '10px',
          fontWeight: '600',
          padding: '3px 10px',
          borderRadius: '20px',
          backgroundColor: post.status === 'Verified' ? '#D1FAE5' : '#F3F4F6',
          color: post.status === 'Verified' ? '#065F46' : '#6B7280',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          {post.status === 'Verified' && (
            <svg width="9" height="9" viewBox="0 0 24 24" fill="#065F46">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          )}
          {post.status}
        </span>
      </div>

      {/* Description */}
      <p style={{
        margin: '0 0 10px 0',
        fontSize: '13px',
        color: '#374151',
        lineHeight: '1.5',
      }}>
        {post.description}
      </p>

      {/* Images */}
      {post.images.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: post.images.length === 1 ? '1fr' : '1fr 1fr',
          gap: '6px',
          marginBottom: '12px',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          {post.images.slice(0, 2).map((img, i) => (
            <div key={i} style={{
              borderRadius: '10px',
              overflow: 'hidden',
              aspectRatio: post.images.length === 1 ? '16/9' : '1/1',
              backgroundColor: '#F3F4F6',
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

      {/* Actions row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '8px 0 14px 0',
      }}>
        {/* Comment count */}
        <button
          onClick={() => {}}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            color: '#6B7280',
            fontSize: '12px',
            fontWeight: '500',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {post.commentCount}
        </button>

        {/* Like */}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(l => !l); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            color: liked ? '#EF4444' : '#6B7280',
            fontSize: '12px',
            fontWeight: '500',
            transition: 'color 0.2s',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={liked ? '#EF4444' : 'none'} stroke={liked ? '#EF4444' : '#6B7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Share */}
        <button
          onClick={(e) => { e.stopPropagation(); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            color: '#6B7280',
            fontSize: '12px',
            fontWeight: '500',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>
      </div>
    </div>
  );
}
