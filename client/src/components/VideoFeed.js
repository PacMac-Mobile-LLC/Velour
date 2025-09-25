import React, { useState, useEffect } from 'react';
import VideoCard from './VideoCard';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-hot-toast';

export function VideoFeed() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth0();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      console.log('Starting to fetch videos...');
      
      const response = await fetch('/api/videos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const videosData = await response.json();
      console.log('Fetched videos from API:', videosData);

      if (!videosData || videosData.length === 0) {
        console.log('No videos found');
        setVideos([]);
        toast.success("No videos yet! Upload your first video to get started!");
        return;
      }

      // Transform the data to match VideoCard interface
      const transformedVideos = videosData.map((video: any) => ({
        id: video.id || 'unknown',
        videoSrc: video.video_url || '',
        user: {
          id: video.user_id || 'unknown',
          username: video.user?.username || 'unknown',
          displayName: video.user?.display_name || 'Unknown User',
          avatar: video.user?.avatar_url || null,
          verified: false,
        },
        description: video.description || video.title || 'No description',
        likes: video.likes || 0,
        comments: video.comments || 0,
        shares: video.shares || 0,
        isLiked: video.isLiked || false,
        isBookmarked: video.isBookmarked || false,
        algorithmScore: Math.random() * 0.3 + 0.7,
        algorithmFactors: ['Recent upload', 'User engagement', 'Content quality'],
      }));

      console.log('Transformed videos:', transformedVideos);
      setVideos(transformedVideos);
      
    } catch (error) {
      console.error('Error fetching videos:', error);
      setVideos([]);
      setError('Failed to load videos');
      toast.error("Failed to load videos. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-screen bg-gray-900 animate-pulse flex items-center justify-center">
            <div className="text-center">
              <div className="h-64 w-64 bg-gray-700 rounded-lg mb-4 mx-auto"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2 mx-auto"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2 text-red-500">Error Loading Videos</h3>
          <p className="text-gray-400 mb-4">
            {error}
          </p>
          <button 
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchVideos();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2 text-white">No videos yet</h3>
          <p className="text-gray-400 mb-4">
            Be the first to upload a video and start the community!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
      {videos.map((video) => (
        <VideoCard key={video.id} {...video} />
      ))}
    </div>
  );
}

export default VideoFeed;
