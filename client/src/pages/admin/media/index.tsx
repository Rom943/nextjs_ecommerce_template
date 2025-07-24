import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  TextField,
  CircularProgress,
  Pagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { withAdminAuth } from '../../../utils/withAdminAuth';
import AdminLayout from "../../../../components/admin/layout/AdminLayout";
import Head from 'next/head';

interface MediaItem {
  id: string;
  url: string;
  altText?: string;
  fileType: 'image' | 'video';
  createdAt: string;
}

const MediaPage = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [editAltText, setEditAltText] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/media?page=${page}&limit=12&search=${search}`);
      const data = await response.json();
      
      setMedia(data.media);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching media:', error);
      showSnackbar('Failed to load media items', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [page, search]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setPage(1);
      fetchMedia();
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleUploadDialogOpen = () => {
    setUploadDialogOpen(true);
  };

  const handleUploadDialogClose = () => {
    setUploadDialogOpen(false);
  };

  const handleEditOpen = (media: MediaItem) => {
    setSelectedMedia(media);
    setEditAltText(media.altText || '');
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setSelectedMedia(null);
  };

  const handleEditSave = async () => {
    if (!selectedMedia) return;

    try {
      const response = await fetch(`/api/admin/media/${selectedMedia.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ altText: editAltText }),
      });

      if (!response.ok) {
        throw new Error('Failed to update media');
      }

      // Update the item in the local state
      setMedia(
        media.map((item) =>
          item.id === selectedMedia.id ? { ...item, altText: editAltText } : item
        )
      );

      showSnackbar('Media updated successfully', 'success');
      handleEditClose();
    } catch (error) {
      console.error('Error updating media:', error);
      showSnackbar('Failed to update media', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media item?')) return;

    try {
      const response = await fetch(`/api/admin/media/${id}?type=image`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete media');
      }

      setMedia(media.filter((item) => item.id !== id));
      showSnackbar('Media deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting media:', error);
      showSnackbar('Failed to delete media', 'error');
    }
  };

  const handleUpload = async (files: FileList) => {
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('file', files[i]);
      }

      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      showSnackbar('Files uploaded successfully', 'success');
      setUploadDialogOpen(false);
      fetchMedia();
    } catch (error) {
      console.error('Upload error:', error);
      showSnackbar('Failed to upload files', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Head>
        <title>Media Library - Admin Dashboard</title>
      </Head>
      <AdminLayout title="Media Library">
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1">
              Media Library
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CloudUploadIcon />}
              onClick={handleUploadDialogOpen}
            >
              Upload New
            </Button>
          </Box>

          <Box sx={{ display: 'flex', mb: 3 }}>
            <TextField
              label="Search media"
              variant="outlined"
              size="small"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={handleSearch}
            />
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
            <Grid container spacing={3}>
              {media.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {item.fileType === 'image' ? (
                      <CardMedia
                        component="img"
                        height="200"
                        image={item.url}
                        alt={item.altText || 'Media item'}
                        sx={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 200,
                          backgroundColor: 'black',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="body2" color="white">
                          Video Preview
                        </Typography>
                      </Box>
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ mb: 1 }} noWrap>
                        {item.altText || item.url.split('/').pop() || 'Untitled'}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <IconButton size="small" onClick={() => handleEditOpen(item)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(item.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </Box>

        {/* Upload Dialog */}
        <UploadDialog
          open={uploadDialogOpen}
          onClose={handleUploadDialogClose}
          onUpload={handleUpload}
        />

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onClose={handleEditClose}>
          <DialogTitle>Edit Media</DialogTitle>
          <DialogContent>
            {selectedMedia && (
              <Box sx={{ pt: 1 }}>
                {selectedMedia.fileType === 'image' && (
                  <Box sx={{ mb: 2, textAlign: 'center' }}>
                    <img
                      src={selectedMedia.url}
                      alt={selectedMedia.altText || 'Preview'}
                      style={{ maxWidth: '100%', maxHeight: '200px' }}
                    />
                  </Box>
                )}
                <TextField
                  label="Alt Text"
                  fullWidth
                  value={editAltText}
                  onChange={(e) => setEditAltText(e.target.value)}
                  margin="normal"
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button onClick={handleEditSave} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </AdminLayout>
    </>
  );
};

// Upload Dialog Component
interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (files: FileList) => void;
}

const UploadDialog: React.FC<UploadDialogProps> = ({ open, onClose, onUpload }) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
    }
  };

  const handleUpload = async () => {
    if (!files) return;

    setUploading(true);
    try {
      await onUpload(files);
      setFiles(null);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFiles(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Upload Media</DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Box
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 1,
              p: 3,
              textAlign: 'center',
              mb: 3,
            }}
          >
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6">Drag files here or click to upload</Typography>
                <Typography variant="body2" color="textSecondary">
                  Supports images and videos
                </Typography>
              </Box>
            </label>
          </Box>

          {files && files.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {files.length} file(s) selected:
              </Typography>
              <Box sx={{ mb: 2, maxHeight: '150px', overflow: 'auto' }}>
                {Array.from(files).map((file, index) => (
                  <Typography key={index} variant="body2">
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </Typography>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={uploading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          color="primary"
          disabled={!files || uploading}
          startIcon={uploading ? <CircularProgress size={24} /> : null}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MediaPage;

export async function getServerSideProps(context) {
  return withAdminAuth(context);
}
