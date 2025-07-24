import { GetServerSideProps, NextPage } from 'next';
import { Container } from '@mui/material';
import AdminLayout from '../../../../components/admin/layout/AdminLayout';
import { withAdminAuth } from '../../../utils/withAdminAuth';
import ProductList from '../../../../components/admin/products/ProductList';

const ProductsPage: NextPage = () => {
  return (
    <AdminLayout title="Products">
      <Container maxWidth="xl">
        <ProductList />
      </Container>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withAdminAuth;

export default ProductsPage;
