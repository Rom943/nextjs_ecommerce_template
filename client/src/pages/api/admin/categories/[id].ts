import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check for admin authentication
  const token = req.cookies.admin_token;
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Get the category ID from the query
  const { id } = req.query;
  
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid category ID' });
  }
  
  // Convert string ID to number
  const categoryId = parseInt(id, 10);
  
  if (isNaN(categoryId)) {
    return res.status(400).json({ message: 'Invalid category ID format' });
  }

  switch (req.method) {
    case 'GET':
      return getCategory(categoryId, res);
    case 'PUT':
      return updateCategory(categoryId, req, res);
    case 'DELETE':
      return deleteCategory(categoryId, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get a single category by ID
async function getCategory(id: number, res: NextApiResponse) {
  try {
    const category = await prisma.productCategory.findUnique({
      where: { id },
      include: {
        products: {
          select: { id: true }
        }
      }
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Get product count
    const productCount = category.products.length;
    
    // Remove the products array from the response to avoid sending too much data
    const { products, ...categoryData } = category;
    
    return res.status(200).json({ 
      category: {
        ...categoryData,
        productCount
      }
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return res.status(500).json({ message: 'Error fetching category', error: (error as Error).message });
  }
}

// Update a category
async function updateCategory(id: number, req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, description, thumbnailImageUrl, HeroImageUrl, subCategories } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    // Check if another category with this name exists (excluding the current one)
    const existingCategory = await prisma.productCategory.findFirst({
      where: {
        name,
        id: { not: id },
      },
    });

    if (existingCategory) {
      return res.status(400).json({ message: 'Another category with this name already exists' });
    }

    // Update the category
    const updatedCategory = await prisma.productCategory.update({
      where: { id },
      data: {
        name,
        description: description || null,
        thumbnailImageUrl: thumbnailImageUrl || null,
        HeroImageUrl: HeroImageUrl || null,
        subCategories: subCategories || {},
      },
    });

    return res.status(200).json({ category: updatedCategory });
  } catch (error) {
    console.error('Error updating category:', error);
    return res.status(500).json({ message: 'Error updating category', error: (error as Error).message });
  }
}

// Delete a category
async function deleteCategory(id: number, res: NextApiResponse) {
  try {
    // Check if the category has associated products
    const category = await prisma.productCategory.findUnique({
      where: { id },
      include: {
        products: {
          select: { id: true }
        }
      }
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category.products.length > 0) {
      return res.status(400).json({ 
        message: `Cannot delete category with associated products. This category has ${category.products.length} products.` 
      });
    }

    // Delete the category
    await prisma.productCategory.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return res.status(500).json({ message: 'Error deleting category', error: (error as Error).message });
  }
}
