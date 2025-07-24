import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
  Typography,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  Pagination
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';

interface Media {
  id: number;
  url: string;
  altText?: string;
  createdAt: string;
  width?: number;
  height?: number;
  fileType?: 'image' | 'video';
  fileSize?: number;
}

interface MediaLibrarySelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string, mediaItem?: Media) => void;
  title?: string;
  acceptType?: 'image' | 'video' | 'all';
  multiple?: boolean;
}

const MediaLibrarySelector: React.FC<MediaLibrarySelectorProps> = ({
  open,
  onClose,
  onSelect,
  title = 'Media Library',
  acceptType = 'image',
  multiple = false
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [loading, setLoading] = useState(false);
  const [media, setMedia] = useState<Media[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [selectedMediaItems, setSelectedMediaItems] = useState<Media[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Fetch media when dialog is opened
  useEffect(() => {
    if (open) {
      fetchMedia();
    }
  }, [open, page]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Filter by media type if needed
      const typeFilter = acceptType !== 'all' ? `&type=${acceptType}` : '';
      
      const response = await fetch(`/api/admin/media?page=${page}&search=${search}${typeFilter}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch media');
      }
      
      const data = await response.json();
      setMedia(data.media);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      console.error('Error fetching media:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1); // Reset to first page
    fetchMedia();
  };

  const handleSelectMedia = (item: Media) => {
    if (multiple) {
      const isAlreadySelected = selectedMediaItems.some(media => media.id === item.id);
      
      if (isAlreadySelected) {
        setSelectedMediaItems(prev => prev.filter(media => media.id !== item.id));
      } else {
        setSelectedMediaItems(prev => [...prev, item]);
      }
    } else {
      setSelectedMedia(selectedMedia?.id === item.id ? null : item);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    
    // Determine if we're filtering by type for upload
    if (acceptType === 'image') {
      // Filter to only allow images
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          formData.append('files', file);
        }
      });
    } else if (acceptType === 'video') {
      // Filter to only allow videos
      Array.from(files).forEach(file => {
        if (file.type.startsWith('video/')) {
          formData.append('files', file);
        }
      });
    } else {
      // Accept all types
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });
    }

    try {
      setUploading(true);
      setError(null);
      
      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }
      
      const result = await response.json();
      
      // Add the newly uploaded media to the list and switch to library tab
      setMedia(prev => [...result.media, ...prev]);
      setActiveTab('library');
      
      // Clear the file input
      e.target.value = '';
    } catch (err) {
      console.error('Error uploading media:', err);
      setError((err as Error).message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleConfirm = () => {
    if (multiple && selectedMediaItems.length > 0) {
      // Handle multiple selection confirmation
      const urls = selectedMediaItems.map(item => item.url);
      onSelect(urls[0], selectedMediaItems[0]); // Currently our interface only supports one
    } else if (selectedMedia) {
      // Handle single selection confirmation
      onSelect(selectedMedia.url, selectedMedia);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {title}
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={(_, newTab) => setActiveTab(newTab)}>
          <Tab label="Media Library" value="library" />
          <Tab label="Upload" value="upload" />
        </Tabs>
      </Box>
      
      <DialogContent sx={{ height: '60vh', minHeight: 400 }}>
        {activeTab === 'library' ? (
          <>
            <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                placeholder="Search media..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleSearch}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {error && (
              <Box sx={{ p: 2, mb: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                <Typography color="error">{error}</Typography>
              </Box>
            )}

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
              </Box>
            ) : media.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography>No media found</Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {media.map((item) => {
                  const isImage = !item.fileType || item.fileType === 'image';
                  const isSelected = multiple 
                    ? selectedMediaItems.some(media => media.id === item.id)
                    : selectedMedia?.id === item.id;
                    
                  return (
                    <Grid item xs={6} sm={4} md={3} lg={2} key={item.id}>
                      <Box 
                        sx={{ 
                          position: 'relative',
                          height: 150, 
                          border: '1px solid',
                          borderColor: isSelected ? 'primary.main' : 'grey.300',
                          borderRadius: 1,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          bgcolor: isSelected ? 'primary.50' : 'transparent',
                          '&:hover': {
                            borderColor: 'primary.light',
                            boxShadow: 1
                          }
                        }}
                        onClick={() => handleSelectMedia(item)}
                      >
                        {isImage ? (
                          <img 
                            src={item.url} 
                            alt={item.altText || 'Media'} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        ) : (
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              width: '100%',
                              height: '100%',
                              bgcolor: 'grey.100'
                            }}
                          >
                            <Typography variant="body2">Video</Typography>
                          </Box>
                        )}
                        
                        {isSelected && (
                          <Box 
                            sx={{ 
                              position: 'absolute', 
                              top: 0, 
                              right: 0, 
                              bgcolor: 'primary.main',
                              color: 'white',
                              px: 1,
                              py: 0.5,
                              borderBottomLeftRadius: 4
                            }}
                          >
                            {multiple ? `✓ ${selectedMediaItems.findIndex(media => media.id === item.id) + 1}` : '✓'}
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            )}

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={(_, newPage) => setPage(newPage)}
                disabled={loading}
              />
            </Box>
          </>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <input
              accept={
                acceptType === 'image' ? 'image/*' : 
                acceptType === 'video' ? 'video/*' : 
                'image/*,video/*'
              }
              style={{ display: 'none' }}
              id="upload-media-button"
              type="file"
              multiple
              onChange={handleFileChange}
            />
            <label htmlFor="upload-media-button">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                disabled={uploading}
                sx={{ mb: 2 }}
              >
                Select Files to Upload
              </Button>
            </label>
            
            {uploading && (
              <Box sx={{ width: '100%', mt: 2 }}>
                <CircularProgress variant="determinate" value={uploadProgress} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Uploading... {uploadProgress}%
                </Typography>
              </Box>
            )}
            
            {error && (
              <Box sx={{ p: 2, mt: 2, bgcolor: 'error.light', borderRadius: 1, width: '100%' }}>
                <Typography color="error">{error}</Typography>
              </Box>
            )}
            
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2, textAlign: 'center' }}>
              {acceptType === 'image' ? 'Upload images (JPG, PNG, GIF, etc.)' : 
               acceptType === 'video' ? 'Upload videos (MP4, MOV, etc.)' : 
               'Upload images or videos'}
            </Typography>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained" 
          color="primary" 
          disabled={multiple ? selectedMediaItems.length === 0 : !selectedMedia}
        >
          Select
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MediaLibrarySelector;
