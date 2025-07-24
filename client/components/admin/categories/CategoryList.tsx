import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Grid,
  InputAdornment
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import Image from 'next/image';
import CategoryForm from './CategoryForm';

interface Category {
  id: number;
  name: string;
  description: string | null;
  thumbnailImageUrl: string | null;
  HeroImageUrl: string | null;
  productCount: number;
  subCategories: any;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  
  const router = useRouter();

  const fetchCategories = async (page = 1, searchTerm = search) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/categories?page=${page}&limit=${pagination.limit}&search=${searchTerm}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch categories');
      }
      
      const data = await response.json();
      setCategories(data.categories);
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChangePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchCategories(newPage);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearch = () => {
    fetchCategories(1, search);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleOpenForm = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
    } else {
      setEditingCategory(null);
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  const handleFormSubmit = async (category: any) => {
    try {
      setLoading(true);
      
      // Determine if this is an update or create
      const method = editingCategory ? 'PUT' : 'POST';
      const url = editingCategory 
        ? `/api/admin/categories/${editingCategory.id}` 
        : '/api/admin/categories';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save category');
      }
      
      // Refresh the list
      await fetchCategories(pagination.page);
      handleCloseForm();
    } catch (err) {
      setError((err as Error).message);
      console.error('Error saving category:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/categories/${categoryToDelete.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete category');
      }
      
      // Refresh the list
      await fetchCategories(pagination.page);
      setDeleteConfirmOpen(false);
      setCategoryToDelete(null);
    } catch (err) {
      setError((err as Error).message);
      console.error('Error deleting category:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Categories
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Add Category
        </Button>
      </Box>

      {error && (
        <Box sx={{ backgroundColor: 'error.light', color: 'error.contrastText', p: 2, mb: 2, borderRadius: 1 }}>
          {error}
        </Box>
      )}

      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search categories..."
              value={search}
              onChange={handleSearchChange}
              onKeyPress={handleSearchKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item>
            <Button 
              variant="contained" 
              onClick={handleSearch}
            >
              Search
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => {
                setSearch('');
                fetchCategories(1, '');
              }}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Thumbnail</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Products</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && pagination.page === 1 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    {category.thumbnailImageUrl ? (
                      <Box sx={{ width: 60, height: 60, position: 'relative', borderRadius: '4px', overflow: 'hidden' }}>
                        <Image
                          src={category.thumbnailImageUrl}
                          alt={category.name}
                          layout="fill"
                          objectFit="cover"
                        />
                      </Box>
                    ) : (
                      <Box sx={{ width: 60, height: 60, bgcolor: 'grey.300', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        No image
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    {category.description ? (
                      category.description.length > 100 
                        ? `${category.description.substring(0, 100)}...` 
                        : category.description
                    ) : '-'}
                  </TableCell>
                  <TableCell>{category.productCount}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      color="primary"
                      onClick={() => handleOpenForm(category)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error"
                      onClick={() => handleDeleteClick(category)}
                      disabled={category.productCount > 0}
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
      <Box mt={2} display="flex" justifyContent="center" alignItems="center">
        <Button 
          disabled={pagination.page === 1 || loading} 
          onClick={() => handleChangePage(pagination.page - 1)}
        >
          Previous
        </Button>
        <Typography mx={2}>
          Page {pagination.page} of {pagination.totalPages} 
          ({pagination.total} categories)
        </Typography>
        <Button 
          disabled={pagination.page === pagination.totalPages || loading} 
          onClick={() => handleChangePage(pagination.page + 1)}
        >
          Next
        </Button>
      </Box>

      {/* Category Form Dialog */}
      <Dialog
        open={isFormOpen}
        onClose={handleCloseForm}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <CategoryForm 
            initialData={editingCategory}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the category "{categoryToDelete?.name}"? 
          This action cannot be undone.
          
          {categoryToDelete && categoryToDelete.productCount > 0 && (
            <Typography color="error" sx={{ mt: 2 }}>
              This category has {categoryToDelete.productCount} products. 
              You must remove or reassign these products before deleting this category.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            disabled={categoryToDelete ? categoryToDelete.productCount > 0 : false}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryList;
