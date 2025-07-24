import { GetServerSideProps, NextPage } from 'next';
import { Box, Typography, Container } from '@mui/material';
import CategoryList from '../../../../components/admin/categories/CategoryList';
import AdminLayout from '../../../../components/admin/layout/AdminLayout';
import { withAdminAuth } from '../../../../src/utils/withAdminAuth';

const CategoriesPage: NextPage = () => {
  return (
    <AdminLayout>
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <CategoryList />
        </Box>
      </Container>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withAdminAuth;

export default CategoriesPage;
