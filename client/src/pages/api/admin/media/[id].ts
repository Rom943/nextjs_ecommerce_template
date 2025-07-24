import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../../lib/prisma';
import cloudinary from '../../../../../lib/cloudinary';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check for admin authentication
  const token = req.cookies.admin_token;
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  switch (req.method) {
    case 'DELETE':
      return deleteMedia(req, res);
    case 'PATCH':
      return updateMedia(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function deleteMedia(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, type = 'image' } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Missing media ID' });
    }

    let media;
    
    // Find the media item in the database based on type
    if (type === 'image') {
      media = await prisma.image.findUnique({
        where: { id: parseInt(id, 10) },
      });
    } else if (type === 'video') {
      media = await prisma.video.findUnique({
        where: { id: parseInt(id, 10) },
      });
    } else {
      return res.status(400).json({ message: 'Invalid media type' });
    }

    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    // Extract cloudinary public ID from URL
    // Assumes URL format like: https://res.cloudinary.com/cloud-name/image/upload/folder/public-id.ext
    const url = media.url;
    
    if (url.includes('cloudinary.com')) {
      try {
        const urlParts = url.split('/');
        const fileNameWithExtension = urlParts.pop() || '';
        const publicIdParts = urlParts.slice(urlParts.indexOf('upload') + 1);
        publicIdParts.push(fileNameWithExtension.split('.')[0]);
        
        const publicId = publicIdParts.join('/');
        
        // Delete from Cloudinary
        await cloudinary.uploader.destroy(publicId, {
          resource_type: type === 'video' ? 'video' : 'image',
        });
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }

    // Delete from database
    if (type === 'image') {
      await prisma.image.delete({
        where: { id: parseInt(id, 10) },
      });
    } else {
      await prisma.video.delete({
        where: { id: parseInt(id, 10) },
      });
    }

    return res.status(200).json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ message: 'Error deleting media', error: (error as Error).message });
  }
}

async function updateMedia(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const { altText, title } = req.body;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Missing media ID' });
    }

    // Convert id to number since our database uses numeric IDs
    const mediaId = parseInt(id, 10);

    // Check if the media exists
    const existingMedia = await prisma.image.findUnique({
      where: { id: mediaId },
    });

    if (!existingMedia) {
      return res.status(404).json({ message: 'Media not found' });
    }

    // Update the media metadata
    const updatedMedia = await prisma.image.update({
      where: { id: mediaId },
      data: {
        altText: altText !== undefined ? altText : existingMedia.altText,
        // Add more fields as needed
      },
    });

    return res.status(200).json({ media: updatedMedia });
  } catch (error) {
    console.error('Update error:', error);
    return res.status(500).json({ message: 'Error updating media', error: (error as Error).message });
  }
}
