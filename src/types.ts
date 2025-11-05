export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  externalId: string;  // YouTube video ID
  externalEmbedUrl: string;  // Ready-to-use embed URL
  status: 'LIVE' | 'ENDED' | 'SCHEDULED';
  scheduledStartAt: string;
}