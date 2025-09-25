import React, { useState } from 'react';
import { X, Copy, Share2, MessageCircle, Mail, Twitter, Facebook } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  videoTitle: string;
  videoUrl: string;
  shareCount: number;
  onShareCountUpdate: (count: number) => void;
}

export function ShareModal({ 
  isOpen, 
  onClose, 
  videoId, 
  videoTitle, 
  videoUrl, 
  shareCount, 
  onShareCountUpdate 
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/video/${videoId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy link');
    }
  };

  const shareToSocial = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(videoTitle);
    
    let shareUrl_platform = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl_platform = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl_platform = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'whatsapp':
        shareUrl_platform = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;
      case 'telegram':
        shareUrl_platform = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl_platform, '_blank', 'width=600,height=400');
    
    // Update share count
    onShareCountUpdate(shareCount + 1);
  };

  const shareViaWebAPI = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: videoTitle,
          text: `Check out this video: ${videoTitle}`,
          url: shareUrl,
        });
        onShareCountUpdate(shareCount + 1);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copy to clipboard
      copyToClipboard();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-sm mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Share Video</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Share Options */}
        <div className="p-4 space-y-4">
          {/* Native Share */}
          {navigator.share && (
            <button
              onClick={shareViaWebAPI}
              className="w-full flex items-center gap-3 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span>Share via...</span>
            </button>
          )}

          {/* Copy Link */}
          <button
            onClick={copyToClipboard}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              copied 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            <Copy className="w-5 h-5" />
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>

          {/* Social Media Options */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => shareToSocial('twitter')}
              className="flex items-center gap-2 p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <Twitter className="w-5 h-5" />
              <span>Twitter</span>
            </button>
            
            <button
              onClick={() => shareToSocial('facebook')}
              className="flex items-center gap-2 p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <Facebook className="w-5 h-5" />
              <span>Facebook</span>
            </button>
            
            <button
              onClick={() => shareToSocial('whatsapp')}
              className="flex items-center gap-2 p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp</span>
            </button>
            
            <button
              onClick={() => shareToSocial('telegram')}
              className="flex items-center gap-2 p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Telegram</span>
            </button>
          </div>

          {/* Share Count */}
          <div className="text-center text-sm text-gray-400">
            {shareCount} shares
          </div>
        </div>
      </div>
    </div>
  );
}
