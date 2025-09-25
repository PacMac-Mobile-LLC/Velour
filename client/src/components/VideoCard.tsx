import React, { useState, useEffect, useRef } from 'react';
import { Heart, Share, Bookmark, TrendingUp, MessageCircle } from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';
import { CommentsModal } from './CommentsModal';
import { ShareModal } from './ShareModal';

interface VideoCardProps {
  id: string;
  videoSrc: string;
  thumbnail?: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
    verified?: boolean;
  };
  description: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  algorithmScore?: number;
  algorithmFactors?: string[];
}

export function VideoCard({
  id,
  videoSrc,
  thumbnail,
  user,
  description,
  likes: initialLikes,
  comments: initialComments,
  shares: initialShares,
  isLiked: initialIsLiked = false,
  isBookmarked = false,
  algorithmScore = 0.85,
  algorithmFactors = ['Engagement rate', 'Recent activity', 'Similar interests']
}: VideoCardProps) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);
  const [shares, setShares] = useState(initialShares);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Intersection Observer to detect when video is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.5, // Video is considered visible when 50% is in view
        rootMargin: '0px'
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const toggleLike = async () => {
    try {
      const response = await fetch(`/api/videos/${id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setIsLiked(result.isLiked);
        setLikes(result.likeCount);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Profile click triggered for user:', user);
  };

  // Safety checks for required props
  if (!id || !videoSrc || !user) {
    console.error('VideoCard missing required props:', { id, videoSrc, user });
    return (
      <div className="relative w-full h-screen bg-gray-900 snap-start snap-always flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p>Error loading video</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={cardRef} className="relative w-full h-screen bg-gray-900 snap-start snap-always">
      {/* Video Player */}
      <VideoPlayer 
        src={videoSrc} 
        poster={thumbnail}
        autoPlay={isVisible}
        muted={!isVisible}
        loop={true}
        videoId={id}
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex z-10">
        {/* Left side - User info and description */}
        <div className="flex-1 flex flex-col justify-end p-4 pb-20 md:pb-8">
          <div className="space-y-3">
            {/* User info */}
            <div className="flex items-center gap-3">
              <button 
                onClick={handleProfileClick}
                className="flex items-center gap-3 hover:opacity-80 transition-all duration-200 hover:scale-105 cursor-pointer p-1 rounded-lg hover:bg-white/5"
                title={`View ${user?.displayName || 'Unknown User'}'s profile`}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.displayName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-medium">
                      {(user?.displayName || 'U').slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white hover:text-blue-400 transition-colors">
                      {user?.displayName || 'Unknown User'}
                    </h3>
                    {user?.verified && (
                      <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-300 hover:text-blue-400/80 transition-colors">
                    {user?.username ? (user.username.startsWith('@') ? user.username : `@${user.username}`) : '@unknown'}
                  </p>
                </div>
              </button>
            </div>

            {/* Description */}
            <p className="text-white text-sm leading-relaxed max-w-sm">
              {description}
            </p>

            {/* Algorithm Transparency */}
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 max-w-sm border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-medium text-white">Algorithm Score</span>
                <span className="text-xs text-blue-500 font-bold">{(algorithmScore * 100).toFixed(0)}%</span>
              </div>
              <div className="text-xs text-gray-400">
                Factors: {algorithmFactors.join(', ')}
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Action buttons */}
        <div className="flex flex-col items-center justify-end gap-4 p-4 pb-20 md:pb-8">
          {/* Like button */}
          <div className="flex flex-col items-center gap-1">
            <button
              className={`w-12 h-12 rounded-full backdrop-blur-sm border-0 flex items-center justify-center transition-all ${
                isLiked 
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/25' 
                  : 'bg-gray-800/20 hover:bg-gray-800/30 text-white'
              }`}
              onClick={toggleLike}
            >
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <span className="text-xs text-white font-medium">{formatNumber(likes)}</span>
          </div>

          {/* Comment button */}
          <div className="flex flex-col items-center gap-1">
            <button
              className="w-12 h-12 rounded-full bg-gray-800/20 backdrop-blur-sm hover:bg-gray-800/30 border-0 text-white flex items-center justify-center"
              onClick={() => setIsCommentsOpen(true)}
            >
              <MessageCircle className="w-6 h-6" />
            </button>
            <span className="text-xs text-white font-medium">{formatNumber(comments)}</span>
          </div>

          {/* Share button */}
          <div className="flex flex-col items-center gap-1">
            <button
              className="w-12 h-12 rounded-full bg-gray-800/20 backdrop-blur-sm hover:bg-gray-800/30 border-0 text-white flex items-center justify-center"
              onClick={() => setIsShareOpen(true)}
            >
              <Share className="w-6 h-6" />
            </button>
            <span className="text-xs text-white font-medium">{formatNumber(shares)}</span>
          </div>

          {/* Bookmark button */}
          <div className="flex flex-col items-center gap-1">
            <button
              className={`w-12 h-12 rounded-full backdrop-blur-sm border-0 flex items-center justify-center transition-all ${
                isBookmarked 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg shadow-yellow-500/25' 
                  : 'bg-gray-800/20 hover:bg-gray-800/30 text-white'
              }`}
            >
              <Bookmark className={`w-6 h-6 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CommentsModal
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        videoId={id}
        commentCount={comments}
        onCommentCountUpdate={setComments}
      />
      
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        videoId={id}
        videoTitle={description}
        videoUrl={videoSrc}
        shareCount={shares}
        onShareCountUpdate={setShares}
      />
    </div>
  );
}

export default VideoCard;
