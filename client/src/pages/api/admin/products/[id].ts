import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check for admin authentication
  const token = req.cookies.admin_token;
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Get the product ID from the query
  const { id } = req.query;
  
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }
  
  // Convert string ID to number
  const productId = parseInt(id, 10);
  
  if (isNaN(productId)) {
    return res.status(400).json({ message: 'Invalid product ID format' });
  }

  switch (req.method) {
    case 'GET':
      return getProduct(productId, res);
    case 'PUT':
      return updateProduct(productId, req, res);
    case 'DELETE':
      return deleteProduct(productId, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get a single product by ID
async function getProduct(id: number, res: NextApiResponse) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        categories: true,
      }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Format the response
    const formattedProduct = {
      ...product,
      images: product.productGalleryUrls ? JSON.parse(JSON.stringify(product.productGalleryUrls)) : [],
      mainImage: product.mainImageUrl || null
    };
    
    return res.status(200).json({ product: formattedProduct });
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({ message: 'Error fetching product', error: (error as Error).message });
  }
}

// Update a product
async function updateProduct(id: number, req: NextApiRequest, res: NextApiResponse) {
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

    // First fetch current product to handle category updates correctly
    const currentProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        categories: true
      }
    });

    if (!currentProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description: description || null,
        price: typeof price === 'number' ? price : parseFloat(price || '0'),
        discount: discount !== undefined ? parseFloat(discount) : currentProduct.discount,
        mainImageUrl: mainImageUrl || currentProduct.mainImageUrl,
        productGalleryUrls: productGalleryUrls || currentProduct.productGalleryUrls,
        stock: stock !== undefined ? parseInt(stock, 10) : currentProduct.stock,
        productAttributes: productAttributes || currentProduct.productAttributes,
        
        // Update categories if provided
        ...(categoryIds && {
          categories: {
            disconnect: currentProduct.categories.map(cat => ({ id: cat.id })),
            connect: categoryIds.map((id: number) => ({ id }))
          }
        })
      },
      include: {
        categories: true
      }
    });

    // Format the response
    const formattedProduct = {
      ...updatedProduct,
      images: updatedProduct.productGalleryUrls ? JSON.parse(JSON.stringify(updatedProduct.productGalleryUrls)) : [],
      mainImage: updatedProduct.mainImageUrl || null
    };

    return res.status(200).json({ product: formattedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ message: 'Error updating product', error: (error as Error).message });
  }
}

// Delete a product
async function deleteProduct(id: number, res: NextApiResponse) {
  try {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete the product
    await prisma.product.delete({
      where: { id }
    });

    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: 'Error deleting product', error: (error as Error).message });
  }
}
