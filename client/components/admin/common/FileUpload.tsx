import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onUploadComplete?: (url: string) => void;
  onError?: (error: Error) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  uploadUrl?: string;
  label?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onUploadComplete,
  onError,
  accept = 'image/*',
  multiple = false,
  maxFiles = 5,
  uploadUrl = '/api/admin/media/upload',
  label = 'Upload File',
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const files = Array.from(event.target.files);
    const filesToAdd = multiple ? files : [files[0]];

    // Limit number of files if multiple is true
    const limitedFiles = filesToAdd.slice(0, maxFiles);
    
    setSelectedFiles(limitedFiles);
    limitedFiles.forEach(file => onFileSelect(file));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('file', file);
      });

      const xhr = new XMLHttpRequest();
      xhr.open('POST', uploadUrl, true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 201 || xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          
          if (onUploadComplete && response.media && response.media.length > 0) {
            // If multiple files were uploaded, pass the URL of the first file
            onUploadComplete(response.media[0].url);
          }
          
          // Clear selected files after successful upload
          setSelectedFiles([]);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } else {
          const error = new Error(`Upload failed with status ${xhr.status}`);
          console.error('Upload error:', error);
          if (onError) {
            onError(error);
          }
        }
        setUploading(false);
      };

      xhr.onerror = () => {
        const error = new Error('Network error during upload');
        console.error('Upload error:', error);
        if (onError) {
          onError(error);
        }
        setUploading(false);
      };

      xhr.send(formData);
    } catch (error) {
      console.error('Upload error:', error);
      if (onError) {
        onError(error instanceof Error ? error : new Error(String(error)));
      }
      setUploading(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />

      <Box
        sx={{
          border: '2px dashed #ccc',
          borderRadius: 1,
          p: 2,
          textAlign: 'center',
          cursor: 'pointer',
          mb: 2,
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'rgba(0, 0, 0, 0.01)',
          },
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
        <Typography variant="body1">{label}</Typography>
        <Typography variant="caption" color="textSecondary">
          {multiple ? `You can select up to ${maxFiles} files` : 'Click to select a file'}
        </Typography>
      </Box>

      {selectedFiles.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Selected files:
          </Typography>
          {selectedFiles.map((file, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid #eee',
                borderRadius: 1,
                p: 1,
                mb: 1,
              }}
            >
              <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </Typography>
              <IconButton size="small" onClick={() => handleRemoveFile(index)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}

          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
            startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
            sx={{ mt: 1 }}
          >
            {uploading ? `Uploading ${progress}%` : 'Upload'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;
