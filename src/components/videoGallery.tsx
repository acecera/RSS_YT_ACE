import React from 'react';
import { Video } from '../types';

interface VideoGalleryItemProps {
  video: Video;
  onSelectVideo: (video: Video) => void;
}

const PlayIcon: React.FC = () => (
  <svg
    className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
      clipRule="evenodd"
    ></path>
  </svg>
);

const VideoGalleryItem: React.FC<VideoGalleryItemProps> = ({ video, onSelectVideo }) => {
  const formattedDate = new Date(video.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <div onClick={() => onSelectVideo(video)} className="cursor-pointer group">
      <div className="relative aspect-video w-full bg-gray-700 rounded-lg overflow-hidden mb-2">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          crossOrigin="anonymous"
          className="relative z-10 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-300">
          <PlayIcon />
        </div>
      </div>
      <h4 className="font-semibold text-white truncate">{video.title}</h4>
      <p className="text-sm text-gray-400">{formattedDate}</p>
    </div>
  );
};

export default VideoGalleryItem;