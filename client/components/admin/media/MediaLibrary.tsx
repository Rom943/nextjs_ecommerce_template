import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tab,
  Tabs
} from '@mui/material';
import { 
  Close as CloseIcon, 
  Search as SearchIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

interface MediaItem {
  id: string;
  url: string;
  altText?: string;
  fileType: 'image' | 'video';
  createdAt: string;
}

interface MediaLibraryProps {
  open: boolean;
  onClose: () => void;
  onSelect: (media: MediaItem) => void;
  selectedId?: string;
  title?: string;
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({
  open,
  onClose,
  onSelect,
  selectedId,
  title = 'Media Library'
}) => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(selectedId || null);
  const { enqueueSnackbar } = useSnackbar();

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/media?page=${page}&limit=20&search=${search}&type=${type}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch media');
      }
      
      const data = await response.json();
      setMedia(data.media);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching media:', error);
      enqueueSnackbar('Error loading media items', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchMedia();
    }
  }, [open, page, type]);

  useEffect(() => {
    if (selectedId) {
      setSelectedMedia(selectedId);
    }
  }, [selectedId]);

  const handleSearch = () => {
    setPage(1); // Reset to first page when searching
    fetchMedia();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelect = (item: MediaItem) => {
    setSelectedMedia(item.id);
    onSelect(item);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const [tabValue, setTabValue] = useState(0);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFiles = Array.from(event.target.files);
      setUploadFiles(selectedFiles);
    }
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      uploadFiles.forEach((file) => {
        formData.append('file', file);
      });

      // Upload the files
      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      // Reset the file input and state
      setUploadFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Refresh the media library
      fetchMedia();
      
      // Switch back to browse tab
      setTabValue(0);
      
      // Show success message
      alert('Files uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading files');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    if (!confirm('Are you sure you want to delete this media item?')) return;
    
    try {
      const response = await fetch(`/api/admin/media/${mediaId}?type=image`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Delete failed');
      }
      
      // Remove the deleted item from the state
      setMedia(media.filter(item => item.id !== mediaId));
      
      // Clear selection if the deleted item was selected
      if (selectedMedia === mediaId) {
        setSelectedMedia(null);
      }
      
      // Show success message
      alert('Media deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting media');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="media-library-dialog-title"
    >
      <DialogTitle id="media-library-dialog-title">
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Browse Media" />
            <Tab label="Upload New" />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                label="Search media"
                variant="outlined"
                size="small"
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={handleKeyPress}
                InputProps={{
                  endAdornment: (
                    <IconButton size="small" onClick={handleSearch}>
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="media-type-label">Type</InputLabel>
                <Select
                  labelId="media-type-label"
                  id="media-type"
                  value={type}
                  label="Type"
                  onChange={(e) => {
                    setType(e.target.value);
                    setPage(1);
                  }}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="image">Images</MenuItem>
                  <MenuItem value="video">Videos</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : media.length === 0 ? (
              <Box sx={{ textAlign: 'center', my: 4 }}>
                <Typography variant="body1">No media found</Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {media.map((item) => (
                  <Grid key={item.id} item xs={12} sm={6} md={4} lg={3}>
                    <Card
                      sx={{
                        border: selectedMedia === item.id ? '2px solid #1976d2' : 'none',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative'
                      }}
                    >
                      <IconButton
                        size="small"
                        color="error"
                        sx={{
                          position: 'absolute',
                          top: 5,
                          right: 5,
                          backgroundColor: 'rgba(255,255,255,0.7)',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.9)'
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMedia(item.id);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <CardActionArea 
                        onClick={() => handleSelect(item)}
                        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
                      >
                        {item.fileType === 'image' ? (
                          <CardMedia
                            component="img"
                            height="140"
                            image={item.url}
                            alt={item.altText || 'Media item'}
                            sx={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <Box
                            sx={{
                              height: 140,
                              backgroundColor: 'black',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Typography variant="body2" color="white">
                              Video Preview
                            </Typography>
                          </Box>
                        )}
                        <CardContent sx={{ p: 1, flexGrow: 1 }}>
                          <Typography variant="body2" noWrap>
                            {item.altText || item.url.split('/').pop() || 'Untitled'}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}

        {tabValue === 1 && (
          <Box sx={{ py: 2 }}>
            <Box 
              sx={{ 
                border: '2px dashed #ccc', 
                borderRadius: 1, 
                p: 3, 
                textAlign: 'center',
                mb: 3
              }}
            >
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
                ref={fileInputRef}
              />
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6">
                  Drag files here or click to upload
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Supports images and videos
                </Typography>
              </Box>
            </Box>
            
            {uploadFiles.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  {uploadFiles.length} file(s) selected:
                </Typography>
                <Box sx={{ mb: 2, maxHeight: '150px', overflow: 'auto' }}>
                  {uploadFiles.map((file, index) => (
                    <Typography key={index} variant="body2">
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </Typography>
                  ))}
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpload}
                  disabled={uploading}
                  startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                >
                  {uploading ? 'Uploading...' : 'Upload Files'}
                </Button>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            const selected = media.find((item) => item.id === selectedMedia);
            if (selected) {
              onSelect(selected);
              onClose();
            } else {
              enqueueSnackbar('Please select a media item', { variant: 'warning' });
            }
          }}
          color="primary"
          disabled={!selectedMedia}
        >
          Select
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MediaLibrary;

// Simple implementation of useSnackbar based on notistack pattern
export function useSnackbar() {
  const enqueueSnackbar = (message: string, options?: { variant: 'success' | 'error' | 'warning' | 'info' }) => {
    // In a real implementation, this would display a toast notification
    // This is a simplified version that just logs to console
    const variant = options?.variant || 'default';
    console.log(`[${variant.toUpperCase()}] ${message}`);
    
    // In a production app, you would use a real notification library like notistack
    // For simple testing, we can also use browser alerts
    if (process.env.NODE_ENV !== 'production') {
      // Optional: Show an alert for easier debugging
      // alert(`${variant.toUpperCase()}: ${message}`);
    }
  };

  return { enqueueSnackbar };
}


