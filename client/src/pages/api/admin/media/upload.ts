import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../../lib/prisma';
import cloudinary from '../../../../../lib/cloudinary';
import { IncomingForm, Fields, Files } from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable body parser to handle form data with files
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Parse form data with files
    const form = new IncomingForm({
      keepExtensions: true,
      maxFileSize: 100 * 1024 * 1024, // 100MB limit
    });

    const { fields, files } = await new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    // Check for file
    const file = files.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileObj = Array.isArray(file) ? file[0] : file;
    const filePath = fileObj.filepath;
    const fileType = fileObj.mimetype || '';

    // Determine resource type (image or video)
    const isVideo = fileType.startsWith('video/');
    const resourceType = isVideo ? 'video' : 'image';

    // Get additional metadata from fields
    const altText = fields.altText ? 
      (Array.isArray(fields.altText) ? fields.altText[0] : fields.altText) : 
      '';
    
    const title = fields.title ? 
      (Array.isArray(fields.title) ? fields.title[0] : fields.title) : 
      '';

    // Upload file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: resourceType,
      folder: `nextjs_ecommerce/${resourceType}s`,
      use_filename: true,
    });

    // Remove temp file
    fs.unlinkSync(filePath);

    // Save to database based on file type
    let savedMedia;

    if (isVideo) {
      savedMedia = await prisma.video.create({
        data: {
          url: uploadResult.secure_url,
          title: title || null,
          description: altText || null,
          thumbnailUrl: uploadResult.thumbnail_url || null,
          duration: Math.round(uploadResult.duration || 0),
        },
      });
    } else {
      savedMedia = await prisma.image.create({
        data: {
          url: uploadResult.secure_url,
          altText: altText || null,
          width: uploadResult.width,
          height: uploadResult.height,
        },
      });
    }

    return res.status(201).json({ 
      success: true, 
      media: savedMedia,
      resourceType
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: 'Error uploading file', error: (error as Error).message });
  }
}
