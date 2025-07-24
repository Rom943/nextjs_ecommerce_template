import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  CircularProgress
} from '@mui/material';
import MediaLibrarySelector from '../media/MediaLibrarySelector';

interface CategoryFormProps {
  initialData?: CategoryFormData | null;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
}

export interface CategoryFormData {
  id?: number;
  name: string;
  description: string;
  thumbnailImageUrl: string | null;
  HeroImageUrl: string | null;
  subCategories?: any;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    thumbnailImageUrl: null,
    HeroImageUrl: null,
    subCategories: {}
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CategoryFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [thumbnailSelectorOpen, setThumbnailSelectorOpen] = useState(false);
  const [heroSelectorOpen, setHeroSelectorOpen] = useState(false);

  // Initialize form with data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        description: initialData.description || '',
        thumbnailImageUrl: initialData.thumbnailImageUrl,
        HeroImageUrl: initialData.HeroImageUrl,
        subCategories: initialData.subCategories || {}
      });
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when field is modified
    if (errors[name as keyof CategoryFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CategoryFormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailSelect = (mediaUrl: string) => {
    setFormData(prev => ({ ...prev, thumbnailImageUrl: mediaUrl }));
    setThumbnailSelectorOpen(false);
  };

  const handleHeroImageSelect = (mediaUrl: string) => {
    setFormData(prev => ({ ...prev, HeroImageUrl: mediaUrl }));
    setHeroSelectorOpen(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Category Name"
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
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Thumbnail Image
          </Typography>
          <Box sx={{ 
            mb: 2, 
            width: '100%', 
            height: 150, 
            border: '1px dashed grey', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            borderRadius: 1,
            overflow: 'hidden',
            bgcolor: formData.thumbnailImageUrl ? 'transparent' : 'grey.100'
          }}>
            {formData.thumbnailImageUrl ? (
              <img 
                src={formData.thumbnailImageUrl} 
                alt="Thumbnail Preview" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              <Typography color="textSecondary">No image selected</Typography>
            )}
          </Box>
          <Box display="flex" gap={1}>
            <Button 
              variant="outlined" 
              onClick={() => setThumbnailSelectorOpen(true)}
            >
              Select Image
            </Button>
            {formData.thumbnailImageUrl && (
              <Button 
                variant="outlined" 
                color="error"
                onClick={() => setFormData(prev => ({ ...prev, thumbnailImageUrl: null }))}
              >
                Remove
              </Button>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Hero Image
          </Typography>
          <Box sx={{ 
            mb: 2, 
            width: '100%', 
            height: 150, 
            border: '1px dashed grey', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            borderRadius: 1,
            overflow: 'hidden',
            bgcolor: formData.HeroImageUrl ? 'transparent' : 'grey.100'
          }}>
            {formData.HeroImageUrl ? (
              <img 
                src={formData.HeroImageUrl} 
                alt="Hero Image Preview" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              <Typography color="textSecondary">No image selected</Typography>
            )}
          </Box>
          <Box display="flex" gap={1}>
            <Button 
              variant="outlined" 
              onClick={() => setHeroSelectorOpen(true)}
            >
              Select Image
            </Button>
            {formData.HeroImageUrl && (
              <Button 
                variant="outlined" 
                color="error"
                onClick={() => setFormData(prev => ({ ...prev, HeroImageUrl: null }))}
              >
                Remove
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button 
          variant="outlined" 
          onClick={onCancel}
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
          {initialData ? 'Update Category' : 'Create Category'}
        </Button>
      </Box>

      {/* Media Library Selector Modals */}
      <MediaLibrarySelector
        open={thumbnailSelectorOpen}
        onClose={() => setThumbnailSelectorOpen(false)}
        onSelect={handleThumbnailSelect}
        title="Select Thumbnail Image"
      />
      <MediaLibrarySelector
        open={heroSelectorOpen}
        onClose={() => setHeroSelectorOpen(false)}
        onSelect={handleHeroImageSelect}
        title="Select Hero Image"
      />
    </Box>
  );
};

export default CategoryForm;
