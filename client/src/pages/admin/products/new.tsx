import { GetServerSideProps, NextPage } from 'next';
import { Container, Box, Typography, Breadcrumbs } from '@mui/material';
import AdminLayout from '../../../../components/admin/layout/AdminLayout';
import { withAdminAuth } from '../../../../src/utils/withAdminAuth';
import ProductForm from '../../../../components/admin/products/ProductForm';
import Link from 'next/link';

const AddProductPage: NextPage = () => {
  return (
    <AdminLayout title="Add New Product">
      <Container maxWidth="xl">
        <Box mb={4}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link href="/admin" passHref>
              Dashboard
            </Link>
            <Link href="/admin/products" passHref>
              Products
            </Link>
            <Typography color="text.primary">Add New</Typography>
          </Breadcrumbs>
          
          <Typography variant="h4" component="h1" mt={2}>
            Add New Product
          </Typography>
        </Box>
        
        <ProductForm />
      </Container>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withAdminAuth;

export default AddProductPage;
