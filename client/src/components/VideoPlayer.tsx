import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, MoreHorizontal } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  videoId?: string;
}

export function VideoPlayer({ 
  src, 
  poster, 
  autoPlay = true, 
  muted = false, 
  loop = true,
  videoId
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleCanPlay = () => {
      // Try to unmute when video can play
      if (video.muted && !isMuted) {
        video.muted = false;
      }
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [isMuted]);

  // Handle dynamic changes to autoPlay and muted props
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Update muted state
    video.muted = muted;
    setIsMuted(muted);

    // Handle autoPlay changes
    if (autoPlay && !video.paused) {
      // Video is already playing, no need to do anything
      return;
    }

    if (autoPlay) {
      // Try to play the video
      video.play().catch((error) => {
        console.log('Autoplay failed:', error);
        // If autoplay fails, mute the video and try again
        video.muted = true;
        setIsMuted(true);
        video.play().catch(console.error);
      });
    } else {
      // Pause the video
      video.pause();
    }
  }, [autoPlay, muted]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
    
    // If unmuting, try to play the video
    if (!video.muted && video.paused) {
      video.play().catch(console.error);
    }
  };

  return (
    <div 
      className="relative w-full h-full group cursor-pointer"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        className="w-full h-full object-cover bg-gray-900"
      />
      
      {/* Mute Indicator (always visible when muted) */}
      {isMuted && (
        <div className="absolute top-4 right-4 bg-red-500/80 backdrop-blur-sm rounded-full p-2">
          <VolumeX className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Video Controls Overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Play/Pause Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            className="w-16 h-16 rounded-full bg-gray-800/20 backdrop-blur-sm hover:bg-gray-800/30 border-0 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              className={`w-10 h-10 rounded-full backdrop-blur-sm border-0 flex items-center justify-center ${
                isMuted 
                  ? 'bg-red-500/20 hover:bg-red-500/30' 
                  : 'bg-gray-800/20 hover:bg-gray-800/30'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              title={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-white" />
              ) : (
                <Volume2 className="w-4 h-4 text-white" />
              )}
            </button>
          </div>

          <button
            className="w-10 h-10 rounded-full bg-gray-800/20 backdrop-blur-sm hover:bg-gray-800/30 border-0 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
