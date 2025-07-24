import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { type = 'all', page = '1', limit = '12' } = req.query;
    
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Fetch total counts for pagination
    const [totalImages, totalVideos] = await Promise.all([
      prisma.image.count(),
      prisma.video.count()
    ]);

    // Fetch media based on type
    let images:any[] = [];
    let videos:any[] = [];

    if (type === 'all' || type === 'image') {
      images = await prisma.image.findMany({
        take: type === 'all' ? Math.floor(limitNum / 2) : limitNum,
        skip: type === 'all' ? Math.floor(skip / 2) : skip,
        orderBy: { createdAt: 'desc' },
      });
    }

    if (type === 'all' || type === 'video') {
      videos = await prisma.video.findMany({
        take: type === 'all' ? Math.ceil(limitNum / 2) : limitNum,
        skip: type === 'all' ? Math.ceil(skip / 2) : skip,
        orderBy: { createdAt: 'desc' },
      });
    }

    return res.status(200).json({
      success: true,
      media: {
        images,
        videos,
      },
      pagination: {
        totalImages,
        totalVideos,
        totalCount: totalImages + totalVideos,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(
          (type === 'all' 
            ? totalImages + totalVideos 
            : type === 'image' ? totalImages : totalVideos) / limitNum
        )
      }
    });
  } catch (error) {
    console.error('Media fetch error:', error);
    return res.status(500).json({ message: 'Error fetching media', error: (error as Error).message });
  }
}
