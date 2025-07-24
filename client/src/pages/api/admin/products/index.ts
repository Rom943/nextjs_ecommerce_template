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
      return getProducts(req, res);
    case 'POST':
      return createProduct(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get all products with pagination, search, and filters
async function getProducts(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { 
      search = '', 
      page = '1', 
      limit = '10',
      category = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;
    const categoryId = category ? parseInt(category as string, 10) : undefined;

    // Build where clause for filtering
    const where: any = {};
    
    // Add search if provided
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' as const } },
        { description: { contains: search as string, mode: 'insensitive' as const } },
      ];
    }
    
    // Add category filter if provided
    if (categoryId && !isNaN(categoryId)) {
      where.categories = {
        some: {
          id: categoryId
        }
      };
    }

    // Determine sort order
    const orderBy: any = {};
    orderBy[sortBy as string] = sortOrder === 'asc' ? 'asc' : 'desc';

    // Get total count for pagination
    const totalCount = await prisma.product.count({ where });

    // Get products with pagination, sorting
    const products = await prisma.product.findMany({
      where,
      skip,
      take: limitNum,
      orderBy,
      include: {
        categories: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Format the response
    const formattedProducts = products.map(product => ({
      ...product,
      images: product.productGalleryUrls ? JSON.parse(JSON.stringify(product.productGalleryUrls)) : [],
      mainImage: product.mainImageUrl || null
    }));

    return res.status(200).json({
      products: formattedProducts,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalCount / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Error fetching products', error: (error as Error).message });
  }
}

// Create a new product
async function createProduct(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { 
      name, 
      description, 
      price, 
      discount,
      mainImageUrl,
      productGalleryUrls,
      categoryIds,
      stock,
      productAttributes,
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Product name is required' });
    }

    if (!price) {
      return res.status(400).json({ message: 'Product price is required' });
    }

    // Create the product with all its relations
    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price: typeof price === 'number' ? price : parseFloat(price || '0'),
        discount: discount ? parseFloat(discount) : 0,
        mainImageUrl: mainImageUrl || null,
        productGalleryUrls: productGalleryUrls || null,
        stock: stock ? parseInt(stock, 10) : 0,
        productAttributes: productAttributes || null,
        rating: 0, // Default rating
        
        // Connect categories if any
        categories: categoryIds && categoryIds.length > 0 ? {
          connect: categoryIds.map((id: number) => ({ id }))
        } : undefined,
      },
      include: {
        categories: true
      }
    });

    return res.status(201).json({ product });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ message: 'Error creating product', error: (error as Error).message });
  }
}
