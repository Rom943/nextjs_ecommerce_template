import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check for admin authentication
  const token = req.cookies.admin_token;
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  switch (req.method) {
    case 'GET':
      return getCategories(req, res);
    case 'POST':
      return createCategory(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get all categories with pagination and search
async function getCategories(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { search = '', page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Create search filter if search parameter exists
    const where = search 
      ? {
          OR: [
            { name: { contains: search as string, mode: 'insensitive' as const } },
            { description: { contains: search as string, mode: 'insensitive' as const } },
          ],
        } 
      : {};

    // Get total count for pagination
    const totalCount = await prisma.productCategory.count({ where });

    // Get categories with products count
    const categoriesWithCount = await prisma.productCategory.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { name: 'asc' },
      include: {
        products: {
          select: { id: true }
        }
      }
    });
    
    // Transform the result to include product count instead of full arrays
    const categories = categoriesWithCount.map(category => {
      const { products, ...rest } = category;
      return {
        ...rest,
        productCount: products.length
      };
    });

    return res.status(200).json({
      categories,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalCount / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ message: 'Error fetching categories', error: (error as Error).message });
  }
}

// Create a new category
async function createCategory(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, description, thumbnailImageUrl, HeroImageUrl, subCategories } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    // Check if a category with this name already exists
    const existingCategory = await prisma.productCategory.findUnique({
      where: { name },
    });

    if (existingCategory) {
      return res.status(400).json({ message: 'A category with this name already exists' });
    }

    // Create the new category
    const category = await prisma.productCategory.create({
      data: {
        name,
        description: description || null,
        thumbnailImageUrl: thumbnailImageUrl || null,
        HeroImageUrl: HeroImageUrl || null,
        subCategories: subCategories || {},
      },
    });

    return res.status(201).json({ category });
  } catch (error) {
    console.error('Error creating category:', error);
    return res.status(500).json({ message: 'Error creating category', error: (error as Error).message });
  }
}
