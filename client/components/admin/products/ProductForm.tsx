import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
  SelectChangeEvent,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import MediaSelector from '../media/MediaSelector';

interface Category {
  id: number;
  name: string;
}

interface ProductFormProps {
  productId?: number; // If provided, we're editing an existing product
}

interface FormErrors {
  [key: string]: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ productId }) => {
  const router = useRouter();
  const isEditing = !!productId;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mainImageSelectorOpen, setMainImageSelectorOpen] = useState(false);
  const [gallerySelectorOpen, setGallerySelectorOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount: '0',
    stock: '0',
    mainImageUrl: '',
    productGalleryUrls: [] as string[],
    categoryIds: [] as number[],
    productAttributes: {} as Record<string, any>
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Fetch categories for the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories?limit=100');
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        setCategories(data.categories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again.');
      }
    };
    
    fetchCategories();
  }, []);
  
  // Fetch product data if editing
  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) return;
      
      try {
        setInitialLoading(true);
        const response = await fetch(`/api/admin/products/${productId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product data');
        }
        
        const data = await response.json();
        const product = data.product;
        
        // Format the data for the form
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price?.toString() || '',
          discount: product.discount?.toString() || '0',
          stock: product.stock?.toString() || '0',
          mainImageUrl: product.mainImageUrl || '',
          productGalleryUrls: Array.isArray(product.productGalleryUrls) 
            ? product.productGalleryUrls 
            : product.productGalleryUrls 
              ? JSON.parse(JSON.stringify(product.productGalleryUrls)) 
              : [],
          categoryIds: product.categories?.map((c: Category) => c.id) || [],
          productAttributes: product.productAttributes || {}
        });
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product data. Please try again.');
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchProductData();
  }, [productId]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when field is modified
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleCategoryChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value as number[];
    setFormData(prev => ({ ...prev, categoryIds: value }));
  };
  
  const handleMainImageSelect = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, mainImageUrl: imageUrl }));
    setMainImageSelectorOpen(false);
  };
  
  const handleGalleryImageSelect = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      productGalleryUrls: [...prev.productGalleryUrls, imageUrl]
    }));
    setGallerySelectorOpen(false);
  };
  
  const handleRemoveGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      productGalleryUrls: prev.productGalleryUrls.filter((_, i) => i !== index)
    }));
  };
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      newErrors.price = 'Price must be a valid positive number';
    }
    
    if (formData.discount && (isNaN(parseFloat(formData.discount)) || parseFloat(formData.discount) < 0 || parseFloat(formData.discount) > 100)) {
      newErrors.discount = 'Discount must be a valid number between 0 and 100';
    }
    
    if (formData.stock && (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0)) {
      newErrors.stock = 'Stock must be a valid positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Prepare data for submission
    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      discount: parseFloat(formData.discount || '0'),
      stock: parseInt(formData.stock || '0'),
      mainImageUrl: formData.mainImageUrl,
      productGalleryUrls: formData.productGalleryUrls.length > 0 ? formData.productGalleryUrls : null,
      categoryIds: formData.categoryIds,
      productAttributes: formData.productAttributes
    };
    
    try {
      setLoading(true);
      setError(null);
      
      const url = isEditing 
        ? `/api/admin/products/${productId}` 
        : '/api/admin/products';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save product');
      }
      
      const result = await response.json();
      
      // Redirect to the products list
      router.push('/admin/products');
    } catch (err) {
      console.error('Error saving product:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  
  if (initialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Box sx={{ mb: 3, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Basic Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              error={!!errors.price}
              helperText={errors.price}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Discount (%)"
              name="discount"
              type="number"
              value={formData.discount}
              onChange={handleInputChange}
              error={!!errors.discount}
              helperText={errors.discount}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleInputChange}
              error={!!errors.stock}
              helperText={errors.stock}
            />
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Categories
        </Typography>
        <FormControl fullWidth>
          <InputLabel id="categories-label">Select Categories</InputLabel>
          <Select
            labelId="categories-label"
            multiple
            value={formData.categoryIds}
            onChange={handleCategoryChange}
            input={<OutlinedInput label="Select Categories" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected as number[]).map((value) => {
                  const category = categories.find(c => c.id === value);
                  return category ? (
                    <Chip key={value} label={category.name} />
                  ) : null;
                })}
              </Box>
            )}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                <Checkbox checked={formData.categoryIds.indexOf(category.id) > -1} />
                <ListItemText primary={category.name} />
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            You can select multiple categories
          </FormHelperText>
        </FormControl>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Product Images
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <MediaSelector
            label="Main Product Image"
            value={formData.mainImageUrl}
            onChange={(url, alt) => {
              setFormData(prev => ({
                ...prev,
                mainImageUrl: url
              }));
            }}
            required
            altTextField
          />
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ mb: 2 }}>
          <MediaSelector
            label="Add Gallery Image"
            value=""
            onChange={(url) => {
              handleGalleryImageSelect(url);
            }}
          />
        </Box>
        
        {formData.productGalleryUrls.length > 0 && (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {formData.productGalleryUrls.map((imageUrl, index) => (
              <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={imageUrl}
                    alt={`Gallery image ${index + 1}`}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardActions>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveGalleryImage(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
      
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined"
          onClick={() => router.push('/admin/products')}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isEditing ? 'Update Product' : 'Create Product'}
        </Button>
      </Box>
    </Box>
  );
};

export default ProductForm;
