import React from 'react';
import { Video } from '../types';

interface VideoCardProps {
  video: Video;
}

const LiveIndicator: React.FC = () => (
  <span className="relative flex h-3 w-3">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
  </span>
);

const VideoDetails: React.FC<VideoCardProps> = ({ video }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center space-x-2 mb-3">
        <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-md flex items-center space-x-2">
          <LiveIndicator />
          <span>Live</span>
        </div>
      </div>
      <h3 className="text-xl font-bold mb-2">{video.title}</h3>
      <p className="text-gray-400 text-sm flex-grow mb-4">{video.description}</p>
      <a
        href={`https://www.youtube.com/watch?v=${video.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto w-full text-center bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
      >
        Join the conversation on YouTube
      </a>
    </div>
  );
};

export default VideoDetails;