import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination,
  Box,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import Image from 'next/image';

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  discount: number | null;
  mainImageUrl: string | null;
  mainImage: string | null; // API returns this format
  stock: number;
  categories: Category[];
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const ProductList: React.FC = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Pagination state
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  
  // Filtering state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Load categories for filtering
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories?limit=100', {
          credentials: 'include', // Include cookies in the request
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Category response error:', response.status, errorText);
          throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Don't show error to user since this is not critical functionality
        // Just use empty categories array
        setCategories([]);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Load products with pagination, search and filters
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      
      if (search) queryParams.append('search', search);
      if (selectedCategory) queryParams.append('category', selectedCategory);
      if (sortBy) {
        queryParams.append('sortBy', sortBy);
        queryParams.append('sortOrder', sortOrder);
      }
      
      const response = await fetch(`/api/admin/products?${queryParams.toString()}`, {
        credentials: 'include', // Include cookies in the request
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Products response error:', response.status, errorText);
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setProducts(data.products || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, [pagination.page, pagination.limit, selectedCategory, sortBy, sortOrder]);
  
  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page === 1) {
        fetchProducts();
      } else {
        // Reset to page 1 when search changes
        setPagination(prev => ({ ...prev, page: 1 }));
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [search]);
  
  const handlePageChange = (_: unknown, newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage + 1 })); // +1 because MUI is 0-indexed
  };
  
  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPagination(prev => ({
      ...prev,
      page: 1, // Reset to first page when changing limit
      limit: parseInt(event.target.value, 10)
    }));
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };
  
  const handleCategoryChange = (event: any) => {
    setSelectedCategory(event.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };
  
  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
  };
  
  const handleSortOrderChange = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
  const handleAddProduct = () => {
    router.push('/admin/products/new');
  };
  
  const handleEditProduct = (id: number) => {
    router.push(`/admin/products/${id}`);
  };
  
  const confirmDelete = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      const response = await fetch(`/api/admin/products/${productToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include', // Include cookies in the request
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete response error:', response.status, errorText);
        throw new Error(`Failed to delete product: ${response.status} ${response.statusText}`);
      }
      
      // Remove deleted product from the list
      setProducts(products.filter(p => p.id !== productToDelete.id));
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      
      // If we deleted the last item on a page, go to previous page
      if (products.length === 1 && pagination.page > 1) {
        setPagination(prev => ({ ...prev, page: prev.page - 1 }));
      } else {
        // Just refresh the current page
        fetchProducts();
      }
    } catch (err: any) {
      setError(err.message || 'Error deleting product');
      setDeleteDialogOpen(false);
    }
  };
  
  const formatPrice = (price: number, discount?: number | null) => {
    if (discount && discount > 0) {
      const discountedPrice = price - (price * discount / 100);
      return (
        <Box>
          <Typography variant="body2" component="span" sx={{ textDecoration: 'line-through', color: 'text.secondary', mr: 1 }}>
            ${price.toFixed(2)}
          </Typography>
          <Typography variant="body2" component="span" sx={{ color: 'error.main', fontWeight: 'bold' }}>
            ${discountedPrice.toFixed(2)}
          </Typography>
          <Typography variant="caption" component="span" sx={{ color: 'error.main', ml: 1 }}>
            (-{discount}%)
          </Typography>
        </Box>
      );
    }
    
    return `$${price.toFixed(2)}`;
  };
  
  return (
    <Box>
      {/* Header section with title and add button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" fontWeight="bold">
          Products
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddProduct}
        >
          Add Product
        </Button>
      </Box>
      
      {/* Filters section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            label="Search Products"
            variant="outlined"
            size="small"
            value={search}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1, minWidth: '200px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl sx={{ minWidth: '200px' }} size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              label="Category"
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map(category => (
                <MenuItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: '150px' }} size="small">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={handleSortChange}
              label="Sort By"
            >
              <MenuItem value="createdAt">Date Added</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="price">Price</MenuItem>
              <MenuItem value="stock">Stock</MenuItem>
            </Select>
          </FormControl>
          
          <Button 
            variant="outlined"
            startIcon={sortOrder === 'asc' ? <FilterIcon /> : <FilterIcon sx={{ transform: 'rotate(180deg)' }} />}
            onClick={handleSortOrderChange}
          >
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </Button>
        </Box>
      </Paper>
      
      {/* Error message */}
      {error && (
        <Box sx={{ mb: 2 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}
      
      {/* Products Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Categories</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">No products found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>
                      {product.mainImageUrl || product.mainImage ? (
                        <Box sx={{ width: 50, height: 50, position: 'relative' }}>
                          <Image
                            src={product.mainImageUrl || product.mainImage || ''}
                            alt={product.name}
                            fill
                            sizes="50px"
                            style={{ objectFit: 'cover' }}
                          />
                        </Box>
                      ) : (
                        <Box sx={{ width: 50, height: 50, bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="caption" color="text.secondary">No Image</Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {product.name}
                      </Typography>
                      {product.description && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {product.description.length > 50 
                            ? `${product.description.substring(0, 50)}...` 
                            : product.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{formatPrice(product.price, product.discount)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={product.stock} 
                        color={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {product.categories.map(category => (
                          <Chip
                            key={category.id}
                            label={category.name}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                        {product.categories.length === 0 && (
                          <Typography variant="caption" color="text.secondary">
                            No categories
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        color="primary" 
                        onClick={() => handleEditProduct(product.id)}
                        title="Edit product"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => confirmDelete(product)}
                        title="Delete product"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={pagination.total}
          rowsPerPage={pagination.limit}
          page={pagination.page - 1} // MUI uses 0-indexed pages
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
        />
      </Paper>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete &ldquo;{productToDelete?.name}&rdquo;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteProduct} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductList;
