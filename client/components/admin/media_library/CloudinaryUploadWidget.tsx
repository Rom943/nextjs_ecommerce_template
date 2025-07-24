import React, { useState, useRef } from 'react';
import styles from './CloudinaryUploadWidget.module.css';

interface UploadWidgetProps {
  onClose: () => void;
  onSuccess: (mediaData: any) => void;
}

export const CloudinaryUploadWidget: React.FC<UploadWidgetProps> = ({ onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState({
    altText: '',
    title: '',
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) return;
    
    // Validate file type
    const isImage = selectedFile.type.startsWith('image/');
    const isVideo = selectedFile.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      setError('Please select an image or video file.');
      return;
    }
    
    // Validate file size (100MB max)
    if (selectedFile.size > 100 * 1024 * 1024) {
      setError('File size exceeds 100MB limit.');
      return;
    }
    
    setFile(selectedFile);
    
    // Generate preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('altText', metadata.altText);
    formData.append('title', metadata.title);
    
    try {
      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }
      
      onSuccess(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={styles.uploadWidgetOverlay}>
      <div className={styles.uploadWidgetModal}>
        <div className={styles.uploadWidgetHeader}>
          <h3>Upload Media</h3>
          <button 
            className={styles.closeButton}
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.uploadForm}>
          {error && (
            <div className={styles.errorMessage}>{error}</div>
          )}
          
          <div className={styles.fileInputArea}>
            <div 
              className={styles.dropZone}
              onClick={() => fileInputRef.current?.click()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) {
                  const dataTransfer = new DataTransfer();
                  dataTransfer.items.add(e.dataTransfer.files[0]);
                  
                  if (fileInputRef.current) {
                    fileInputRef.current.files = dataTransfer.files;
                    const event = new Event('change', { bubbles: true });
                    fileInputRef.current.dispatchEvent(event);
                  }
                }
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              {preview ? (
                <div className={styles.previewContainer}>
                  {file?.type.startsWith('image/') ? (
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className={styles.imagePreview}
                    />
                  ) : (
                    <video 
                      src={preview} 
                      className={styles.videoPreview}
                      controls
                    />
                  )}
                </div>
              ) : (
                <>
                  <div className={styles.uploadIcon}>+</div>
                  <p>Click to select or drag a file here</p>
                  <p className={styles.supportedFormats}>
                    Supports: JPEG, PNG, GIF, SVG, MP4, WebM
                  </p>
                </>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*, video/*"
              style={{ display: 'none' }}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input 
              type="text"
              id="title"
              name="title"
              value={metadata.title}
              onChange={handleInputChange}
              className={styles.textInput}
              placeholder="Enter a title for this media"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="altText">Alt Text / Description</label>
            <textarea 
              id="altText"
              name="altText"
              value={metadata.altText}
              onChange={handleInputChange}
              className={styles.textArea}
              placeholder="Describe this media for accessibility"
              rows={3}
            />
          </div>
          
          <div className={styles.formActions}>
            <button 
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className={styles.uploadButton}
              disabled={loading || !file}
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
