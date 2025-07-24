import { GetServerSideProps, NextPage } from 'next';
import { Container, Box, Typography, Breadcrumbs, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import AdminLayout from '../../../../components/admin/layout/AdminLayout';
import { withAdminAuth } from '../../../../src/utils/withAdminAuth';
import ProductForm from '../../../../components/admin/products/ProductForm';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const EditProductPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [productName, setProductName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductName = async () => {
      if (!id) return;
      
      try {
        const response = await fetch(`/api/admin/products/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        
        const data = await response.json();
        setProductName(data.product.name);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. It may have been deleted or you do not have permission to view it.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProductName();
    }
  }, [id]);

  if (!id || Array.isArray(id)) {
    return (
      <AdminLayout title="Invalid Product">
        <Container maxWidth="xl">
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="error" variant="h5">
              Invalid product ID
            </Typography>
            <Box mt={2}>
              <Link href="/admin/products" passHref>
                Back to products
              </Link>
            </Box>
          </Box>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={loading ? "Edit Product" : `Edit: ${productName}`}>
      <Container maxWidth="xl">
        <Box mb={4}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link href="/admin" passHref>
              Dashboard
            </Link>
            <Link href="/admin/products" passHref>
              Products
            </Link>
            <Typography color="text.primary">
              {loading ? "Edit Product" : `Edit: ${productName}`}
            </Typography>
          </Breadcrumbs>
          
          <Typography variant="h4" component="h1" mt={2}>
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                Edit Product <CircularProgress size={24} />
              </Box>
            ) : (
              `Edit: ${productName}`
            )}
          </Typography>
        </Box>
        
        {error ? (
          <Box sx={{ p: 3, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography color="error">{error}</Typography>
            <Box mt={2}>
              <Link href="/admin/products" passHref>
                Back to products
              </Link>
            </Box>
          </Box>
        ) : (
          <ProductForm productId={parseInt(id, 10)} />
        )}
      </Container>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withAdminAuth;

export default EditProductPage;
