import React, { ReactNode } from 'react';
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, useTheme, useMediaQuery } from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Category as CategoryIcon,
  Inventory as InventoryIcon,
  ShoppingCart as OrderIcon,
  People as CustomerIcon,
  Settings as SettingIcon,
  Image as MediaIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

// Navigation items for the sidebar
const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { text: 'Products', icon: <InventoryIcon />, path: '/admin/products' },
  { text: 'Categories', icon: <CategoryIcon />, path: '/admin/categories' },
  { text: 'Orders', icon: <OrderIcon />, path: '/admin/orders' },
  { text: 'Customers', icon: <CustomerIcon />, path: '/admin/customers' },
  { text: 'Media', icon: <MediaIcon />, path: '/admin/media' },
  { text: 'Settings', icon: <SettingIcon />, path: '/admin/settings' },
];

const drawerWidth = 240;

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title = 'Admin Dashboard' }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/auth/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        router.push('/admin_login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const drawer = (
    <Box>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          E-commerce Admin
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => {
          const isActive = router.pathname === item.path || router.pathname.startsWith(`${item.path}/`);
          
          return (
            <ListItem 
              key={item.text}
              onClick={() => router.push(item.path)}
              sx={{
                bgcolor: isActive ? 'primary.light' : 'transparent',
                color: isActive ? 'primary.contrastText' : 'text.primary',
                '&:hover': {
                  bgcolor: isActive ? 'primary.main' : 'action.hover',
                },
                cursor: 'pointer'
              }}
            >
              <ListItemIcon sx={{ color: isActive ? 'primary.contrastText' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          );
        })}
        
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <Head>
        <title>{title} | E-commerce Admin</title>
      </Head>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <AppBar
          position="fixed"
          sx={{
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: { md: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
          {/* Mobile drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          
          {/* Desktop drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        
        <Box
          component="main"
          sx={{ 
            flexGrow: 1, 
            width: { md: `calc(100% - ${drawerWidth}px)` },
            pt: { xs: 8, md: 10 }, // Account for AppBar height
            px: { xs: 2, md: 4 },
            pb: 4
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
};

export default AdminLayout;
