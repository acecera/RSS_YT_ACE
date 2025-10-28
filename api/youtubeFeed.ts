export default async function handler(req: any, res: any) {
  const channelId = req.query.channelId as string;
  
  if (!channelId) {
    return res.status(400).json({ error: 'channelId required' });
  }

  try {
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const response = await fetch(feedUrl);
    
    if (!response.ok) {
      throw new Error(`YouTube feed error: ${response.statusText}`);
    }
    
    const data = await response.text();
    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to fetch feed' });
  }
}