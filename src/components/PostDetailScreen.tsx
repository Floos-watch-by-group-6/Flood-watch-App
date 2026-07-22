import { useState, useRef, useEffect } from 'react';
import type { FeedPost } from './FeedScreen';

interface Comment {
  id: number;
  username: string;
  timeAgo: string;
  text: string;
}

interface PostDetailScreenProps {
  post: FeedPost;
  currentUser: string;
  onBack: () => void;
}

function severityColors(level: 'Low' | 'Medium' | 'High'): { bg: string; text: string } {
  switch (level) {
    case 'High': return { bg: '#FDECEA', text: '#C62828' };
    case 'Medium': return { bg: '#FFF3E0', text: '#E65100' };
    case 'Low': return { bg: '#FFFDE7', text: '#F57F17' };
  }
}

function severityLabel(level: 'Low' | 'Medium' | 'High'): string {
  switch (level) {
    case 'High': return 'High Severity';
    case 'Medium': return 'Med Severity';
    case 'Low': return 'Low Severity';
  }
}

const INITIAL_COMMENTS: Comment[] = [
  {
    id: 1,
    username: 'KBSHOGI',
    timeAgo: '22 min ago',
    text: 'I feel you skii. same thing over here',
  },
  {
    id: 2,
    username: 'LekiWatcher',
    timeAgo: '18 min ago',
    text: 'The water level is still rising on Admiralty Way, be careful!',
  },
];

export default function PostDetailScreen({ post, currentUser, onBack }: PostDetailScreenProps) {
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [replyText, setReplyText] = useState('');
  const [hasNewComment, setHasNewComment] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sevColors = severityColors(post.severity);

  const handleSend = () => {
    const text = replyText.trim();
    if (!text) return;
    const newComment: Comment = {
      id: Date.now(),
      username: currentUser || 'You',
      timeAgo: 'Just now',
      text,
    };
    setComments(prev => [...prev, newComment]);
    setReplyText('');
    setHasNewComment(false);
    // scroll to bottom after sending
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  // Focus input on mount
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#F6F7F9',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '"Euclid", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        zIndex: 15,
        animation: 'postDetailIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) both',
      }}
    >
      <style>{`
        @keyframes postDetailIn {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── STICKY HEADER ── */}
      <div style={{
        position: 'sticky',
        top: 0,
        backgroundColor: '#F6F7F9',
        zIndex: 10,
        padding: '52px 20px 14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Back button */}
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            left: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0px 2px 10px rgba(0,0,0,0.10)',
            cursor: 'pointer',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1F2937" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19L5 12L12 5" />
          </svg>
        </button>

        <h2 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#111827' }}>Posts</h2>
      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: '90px',
        }}
      >
        {/* ── ORIGINAL POST CARD ── */}
        <div style={{
          backgroundColor: '#FFFFFF',
          margin: '8px 12px',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0px 1px 6px rgba(0,0,0,0.06)',
        }}>
          {/* User row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #003366 0%, #1a5fa8 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '10px', fontWeight: '700', flexShrink: 0,
            }}>
              {post.username.slice(0, 2).toUpperCase()}
            </div>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#111827' }}>@{post.username}</span>
            <span style={{ fontSize: '11px', color: '#9CA3AF' }}>|</span>
            <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{post.timeAgo}</span>
          </div>

          {/* Reported at */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#111827' }}>Reported at:</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#EF4444" style={{ flexShrink: 0 }}>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>{post.locationName}</span>
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '11px', fontWeight: '600', padding: '3px 10px',
              borderRadius: '20px', backgroundColor: sevColors.bg, color: sevColors.text,
              display: 'inline-flex', alignItems: 'center', gap: '4px',
            }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: sevColors.text, display: 'inline-block' }} />
              {severityLabel(post.severity)}
            </span>
            <span style={{
              fontSize: '11px', fontWeight: '600', padding: '3px 10px',
              borderRadius: '20px',
              backgroundColor: post.status === 'Verified' ? '#D1FAE5' : '#F3F4F6',
              color: post.status === 'Verified' ? '#065F46' : '#6B7280',
              display: 'inline-flex', alignItems: 'center', gap: '4px',
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
          <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#374151', lineHeight: '1.55' }}>
            {post.description}
          </p>

          {/* Images */}
          {post.images.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: post.images.length === 1 ? '1fr' : '1fr 1fr',
              gap: '6px',
              borderRadius: '12px',
              overflow: 'hidden',
            }}>
              {post.images.slice(0, 2).map((img, i) => (
                <div key={i} style={{
                  borderRadius: '10px', overflow: 'hidden',
                  aspectRatio: post.images.length === 1 ? '16/9' : '1/1',
                  backgroundColor: '#F3F4F6',
                }}>
                  <img
                    src={img}
                    alt={`flood ${i + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── NEW WATCHER COMMENT BANNER ── */}
        {hasNewComment && (
          <div style={{
            backgroundColor: '#FFFFFF',
            margin: '6px 12px',
            borderRadius: '14px',
            padding: '13px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0px 1px 6px rgba(0,0,0,0.05)',
            animation: 'fadeSlideUp 0.3s ease both',
          }}>
            <img src="/src/assets/Floodwatchlogo.svg" alt="" width={26} height={26} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#0D9488' }}>
              + {comments.length} new watcher comment{comments.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* ── COMMENTS LIST ── */}
        <div style={{ margin: '4px 0' }}>
          {comments.map((comment, idx) => (
            <div
              key={comment.id}
              style={{
                backgroundColor: '#FFFFFF',
                margin: '4px 12px',
                borderRadius: '14px',
                padding: '14px 16px',
                boxShadow: '0px 1px 4px rgba(0,0,0,0.05)',
                animation: idx >= INITIAL_COMMENTS.length ? 'fadeSlideUp 0.25s ease both' : 'none',
              }}
            >
              {/* Comment user row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <div style={{
                  width: '26px', height: '26px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #374151 0%, #6B7280 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '9px', fontWeight: '700', flexShrink: 0,
                }}>
                  {comment.username.slice(0, 2).toUpperCase()}
                </div>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#111827' }}>@{comment.username}</span>
                <span style={{ fontSize: '11px', color: '#9CA3AF' }}>|</span>
                <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{comment.timeAgo}</span>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: '#F3F4F6', marginBottom: '8px' }} />

              {/* Comment text */}
              <p style={{ margin: 0, fontSize: '13px', color: '#374151', lineHeight: '1.5' }}>
                {comment.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── PINNED REPLY BAR ── */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#F6F7F9',
        padding: '10px 16px 32px 16px',
        borderTop: '1px solid #EFEFEF',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: '#FFFFFF',
          borderRadius: '50px',
          padding: '10px 14px 10px 14px',
          border: '1.5px solid #E5E7EB',
          boxShadow: '0px 2px 8px rgba(0,0,0,0.06)',
        }}>
          {/* Avatar icon */}
          <div style={{
            width: '30px', height: '30px', borderRadius: '50%',
            border: '1.5px solid #D1D5DB',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            placeholder={`Reply to ${post.username}`}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              color: '#111827',
              backgroundColor: 'transparent',
              fontFamily: 'inherit',
            }}
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!replyText.trim()}
            style={{
              flexShrink: 0,
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: replyText.trim() ? '#003366' : 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: replyText.trim() ? 'pointer' : 'default',
              transition: 'background-color 0.2s',
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={replyText.trim() ? '#FFFFFF' : '#9CA3AF'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
