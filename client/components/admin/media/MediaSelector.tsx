import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import MediaLibrary from './MediaLibrary';
import Image from 'next/image';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

interface MediaSelectorProps {
  label: string;
  value: string;
  onChange: (url: string, alt?: string) => void;
  required?: boolean;
  altTextField?: boolean;
  altText?: string;
  onAltTextChange?: (alt: string) => void;
}

interface MediaItem {
  id: string;
  url: string;
  altText?: string;
  fileType: 'image' | 'video';
  createdAt: string;
}

const MediaSelector: React.FC<MediaSelectorProps> = ({
  label,
  value,
  onChange,
  required = false,
  altTextField = false,
  altText = '',
  onAltTextChange,
}) => {
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(value);

  const handleSelect = (media: MediaItem) => {
    setPreviewUrl(media.url);
    onChange(media.url, media.altText);
    if (onAltTextChange && media.altText) {
      onAltTextChange(media.altText);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        {label} {required && <span style={{ color: 'red' }}>*</span>}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          mb: 2,
        }}
      >
        {previewUrl ? (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: 200,
              mb: 1,
              border: '1px solid #ddd',
              borderRadius: 1,
              overflow: 'hidden',
            }}
          >
            <Image
              src={previewUrl}
              alt={altText || 'Preview'}
              fill
              style={{ objectFit: 'contain' }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: 200,
              mb: 1,
              border: '1px dashed #ccc',
              borderRadius: 1,
              backgroundColor: '#f9f9f9',
            }}
          >
            <Typography variant="body2" color="textSecondary">
              No image selected
            </Typography>
          </Box>
        )}

        <Button
          variant="outlined"
          startIcon={<AddPhotoAlternateIcon />}
          onClick={handleOpen}
          sx={{ alignSelf: 'flex-start' }}
        >
          {previewUrl ? 'Change Image' : 'Select Image'}
        </Button>
      </Box>

      {altTextField && onAltTextChange && (
        <TextField
          fullWidth
          label="Alt Text"
          variant="outlined"
          value={altText}
          onChange={(e) => onAltTextChange(e.target.value)}
          margin="normal"
        />
      )}

      <MediaLibrary
        open={open}
        onClose={handleClose}
        onSelect={handleSelect}
        selectedId={value}
        title="Select Media"
      />
    </Box>
  );
};

export default MediaSelector;
