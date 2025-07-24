import { NextApiResponse } from 'next';
import { prisma } from '../../../../../lib/prisma';
import { createAdminProtectedHandler } from '../../../../utils/apiHandler';
import { AuthenticatedRequest } from '../../../../utils/adminAuthMiddleware';

export default createAdminProtectedHandler({
  GET: getMediaItems
});

async function getMediaItems(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const { page = '1', limit = '20', search = '', type = 'all' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build the where clause for filtering
    const where: any = {};
    
    // Add search if provided
    if (search) {
      where.OR = [
        { url: { contains: search as string, mode: 'insensitive' as const } },
        { altText: { contains: search as string, mode: 'insensitive' as const } },
      ];
    }
    
    // Filter by media type if specified
    if (type === 'image') {
      // No need to filter for images if using the Image model directly
    } else if (type === 'video') {
      // If videos are stored in a different model, we would filter here
    }

    // Get total count for pagination from the Image model
    const totalCount = await prisma.image.count({ where });

    // Get media items with pagination
    const media = await prisma.image.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      media: media.map(item => ({
        ...item,
        fileType: 'image' // All items from Image model are images
      })),
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalCount / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    return res.status(500).json({ message: 'Error fetching media', error: (error as Error).message });
  }
}
