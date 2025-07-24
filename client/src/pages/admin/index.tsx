import { GetServerSideProps, NextPage } from 'next';
import { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid, Paper, CircularProgress, Card, CardContent, CardHeader, Button } from '@mui/material';
import { withAdminAuth } from '../../utils/withAdminAuth';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import Link from 'next/link';

const AdminDashboard: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    customers: 0
  });

  useEffect(() => {
    // Simulate loading stats
    const timer = setTimeout(() => {
      setLoading(false);
      setStats({
        products: 24,
        categories: 8,
        orders: 152,
        customers: 87
      });
    }, 1500);

    return () => clearTimeout(timer);

    // In a real app, you'd fetch stats from an API
    // fetchDashboardStats();
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome to your e-commerce admin dashboard
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ bgcolor: 'error.light', p: 3, borderRadius: 1 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard 
                  title="Total Products" 
                  value={stats.products.toString()} 
                  linkText="View Products"
                  linkHref="/admin/products"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard 
                  title="Categories" 
                  value={stats.categories.toString()} 
                  linkText="Manage Categories"
                  linkHref="/admin/categories"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard 
                  title="Total Orders" 
                  value={stats.orders.toString()} 
                  linkText="View Orders"
                  linkHref="/admin/orders"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard 
                  title="Customers" 
                  value={stats.customers.toString()} 
                  linkText="View Customers"
                  linkHref="/admin/customers"
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Recent Activity
                  </Typography>
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                      Recent activity data will appear here
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Quick Links
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Link href="/admin/products/new" passHref>
                      <Button fullWidth variant="outlined" component="a">
                        Add New Product
                      </Button>
                    </Link>
                    <Link href="/admin/categories" passHref>
                      <Button fullWidth variant="outlined" component="a">
                        Manage Categories
                      </Button>
                    </Link>
                    <Link href="/admin/media" passHref>
                      <Button fullWidth variant="outlined" component="a">
                        Media Library
                      </Button>
                    </Link>
                    <Link href="/admin/settings" passHref>
                      <Button fullWidth variant="outlined" component="a">
                        Store Settings
                      </Button>
                    </Link>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </AdminLayout>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  linkText: string;
  linkHref: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, linkText, linkHref }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Typography variant="h6" component="h2" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h3" component="p" sx={{ mb: 2, fontWeight: 'bold' }}>
        {value}
      </Typography>
      <Link href={linkHref} passHref>
        <Button size="small" component="a">
          {linkText}
        </Button>
      </Link>
    </CardContent>
  </Card>
);

export const getServerSideProps: GetServerSideProps = withAdminAuth;

export default AdminDashboard;
