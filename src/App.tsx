import React, { useState, useMemo, useEffect } from 'react';
import { Video } from './types';
import { YOUTUBE_CHANNEL_ID, VIDEOS_PER_PAGE } from './constants';
import VideoPlayer from './components/videoPlayer';
import VideoDetails from './components/videoCard';
import VideoGalleryItem from './components/videoGallery';
import Pagination from './components/pagination';

const App: React.FC = () => {
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/youtube-feed?channelId=${YOUTUBE_CHANNEL_ID}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch feed: ${response.statusText}`);
        }
        const data = await response.text();
        console.log('Raw API response:', data);
        console.log('Response length:', data.length);
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, 'application/xml');
        const entries = Array.from(xml.querySelectorAll('entry'));
        
        if (entries.length === 0) {
            // Check for parse errors or empty feed
            const errorNode = xml.querySelector('parsererror');
            if (errorNode) {
                console.error('XML Parsing Error:', errorNode.textContent);
                throw new Error('Failed to parse the video feed. The format might be incorrect.');
            }
            // Feed is valid XML but has no entries
            setAllVideos([]);
            setCurrentVideo(null);
            setIsLoading(false);
            return;
        }

        const parsedVideos: Video[] = entries.map((entry, index) => {
          const id = entry.querySelector('id')?.textContent ?? '';
          const videoId = id.split(':').pop() ?? '';
          
          // Debug logging
          if (index === 0) {
            console.log('First entry:', entry);
            console.log('ID field:', id);
            console.log('Video ID:', videoId);
          }
          
          return {
            id: videoId,
            title: entry.querySelector('title')?.textContent ?? 'No Title',
            description: entry.querySelector('media\\:description')?.textContent ?? 'No Description',
            thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
            publishedAt: entry.querySelector('published')?.textContent ?? new Date().toISOString(),
          };
        });
        
        setAllVideos(parsedVideos);
        if (parsedVideos.length > 0) {
          setCurrentVideo(parsedVideos[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const otherVideos = useMemo(() => allVideos.slice(1), [allVideos]);

  const totalPages = Math.ceil(otherVideos.length / VIDEOS_PER_PAGE);

  const videosForCurrentPage = useMemo(() => {
    const startIndex = (currentPage - 1) * VIDEOS_PER_PAGE;
    const endIndex = startIndex + VIDEOS_PER_PAGE;
    return otherVideos.slice(startIndex, endIndex);
  }, [currentPage, otherVideos]);

  const handleSelectVideo = (video: Video) => {
    setCurrentVideo(video);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center text-xl font-semibold">Loading videos...</div>;
    }
    if (error) {
      return <div className="text-center text-xl font-semibold text-red-500">Error: {error}</div>;
    }
    if (!currentVideo) {
      return <div className="text-center text-xl font-semibold">No videos found. The channel might not have any videos or the feed could not be loaded.</div>;
    }
    return (
      <>
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Latest episode</h2>
          <div className="bg-gray-800 rounded-lg p-4 md:p-6">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-9">
                <VideoPlayer videoId={currentVideo.id} />
              </div>
              <div className="col-span-12 lg:col-span-3">
                <VideoDetails video={currentVideo} />
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Other Episodes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {videosForCurrentPage.map((video) => (
              <VideoGalleryItem
                key={video.id}
                video={video}
                onSelectVideo={handleSelectVideo}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </section>
      </>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-6 lg:p-8">
      <main className="max-w-7xl mx-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;