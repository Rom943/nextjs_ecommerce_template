import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../../lib/prisma';
import cloudinary from '../../../../../lib/cloudinary';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id, type } = req.query;
    
    if (!id || !type || (type !== 'image' && type !== 'video')) {
      return res.status(400).json({ message: 'Invalid parameters' });
    }

    // Get the media item
    let mediaItem;
    if (type === 'image') {
      mediaItem = await prisma.image.findUnique({
        where: { id: parseInt(id as string, 10) },
      });
    } else {
      mediaItem = await prisma.video.findUnique({
        where: { id: parseInt(id as string, 10) },
      });
    }

    if (!mediaItem) {
      return res.status(404).json({ message: `${type} not found` });
    }

    // Extract public ID from URL
    const url = mediaItem.url;
    const splitUrl = url.split('/');
    const filenameWithExtension = splitUrl[splitUrl.length - 1];
    const filename = filenameWithExtension.split('.')[0];
    const folderPath = splitUrl[splitUrl.length - 2];
    const publicId = `${folderPath}/${filename}`;

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: type === 'video' ? 'video' : 'image',
      });
    } catch (cloudinaryError) {
      console.error('Error deleting from Cloudinary:', cloudinaryError);
      // Continue with DB deletion even if Cloudinary fails
    }

    // Delete from database
    if (type === 'image') {
      await prisma.image.delete({
        where: { id: parseInt(id as string, 10) },
      });
    } else {
      await prisma.video.delete({
        where: { id: parseInt(id as string, 10) },
      });
    }

    return res.status(200).json({ 
      success: true,
      message: `${type} deleted successfully`
    });
  } catch (error) {
    console.error('Media delete error:', error);
    return res.status(500).json({ message: `Error deleting ${req.query.type}`, error: (error as Error).message });
  }
}
