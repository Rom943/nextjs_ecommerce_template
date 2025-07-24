import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from './MediaLibrary.module.css';
import { CloudinaryUploadWidget } from './CloudinaryUploadWidget';

type MediaType = 'all' | 'image' | 'video';

interface ImageItem {
  id: number;
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
  createdAt: string;
}

interface VideoItem {
  id: number;
  url: string;
  title: string | null;
  description: string | null;
  thumbnailUrl: string | null;
  duration: number | null;
  createdAt: string;
}

interface MediaLibraryProps {
  onSelect?: (media: ImageItem | VideoItem, type: 'image' | 'video') => void;
  selectable?: boolean;
}

export default function MediaLibrary({ onSelect, selectable = false }: MediaLibraryProps) {
  const [activeTab, setActiveTab] = useState<MediaType>('all');
  const [images, setImages] = useState<ImageItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMedia, setSelectedMedia] = useState<{item: ImageItem | VideoItem, type: 'image' | 'video'} | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  
  const router = useRouter();
  
  // Function to fetch media
  const fetchMedia = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/admin/media/list?type=${activeTab}&page=${page}&limit=12`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch media');
      }
      
      setImages(data.media.images || []);
      setVideos(data.media.videos || []);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch media when tab or page changes
  useEffect(() => {
    fetchMedia();
  }, [activeTab, page]);
  
  // Handle media deletion
  const handleDelete = async (id: number, type: 'image' | 'video') => {
    if (!confirm('Are you sure you want to delete this media?')) return;
    
    try {
      const res = await fetch(`/api/admin/media/delete?id=${id}&type=${type}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete media');
      }
      
      // Refresh media list
      fetchMedia();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete media');
    }
  };
  
  // Handle media selection
  const handleSelect = (item: ImageItem | VideoItem, type: 'image' | 'video') => {
    if (selectable && onSelect) {
      setSelectedMedia({ item, type });
      onSelect(item, type);
    }
  };
  
  // Handle successful upload
  const handleUploadSuccess = () => {
    setUploadOpen(false);
    fetchMedia();
  };
  
  return (
    <div className={styles.mediaLibraryContainer}>
      <div className={styles.mediaHeader}>
        <h2>Media Library</h2>
        <button 
          className={styles.uploadButton}
          onClick={() => setUploadOpen(true)}
        >
          Upload New Media
        </button>
      </div>
      
      {uploadOpen && (
        <CloudinaryUploadWidget 
          onClose={() => setUploadOpen(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
      
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
      
      <div className={styles.mediaTabs}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'all' ? styles.active : ''}`}
          onClick={() => { setActiveTab('all'); setPage(1); }}
        >
          All Media
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'image' ? styles.active : ''}`}
          onClick={() => { setActiveTab('image'); setPage(1); }}
        >
          Images
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'video' ? styles.active : ''}`}
          onClick={() => { setActiveTab('video'); setPage(1); }}
        >
          Videos
        </button>
      </div>
      
      {loading ? (
        <div className={styles.loading}>Loading media...</div>
      ) : (
        <div className={styles.mediaGrid}>
          {/* Render Images */}
          {(activeTab === 'all' || activeTab === 'image') && images.map(image => (
            <div 
              key={`image-${image.id}`} 
              className={`${styles.mediaItem} ${selectedMedia?.item.id === image.id && selectedMedia?.type === 'image' ? styles.selected : ''}`}
              onClick={() => selectable && handleSelect(image, 'image')}
            >
              <div className={styles.mediaItemInner}>
                <Image 
                  src={image.url}
                  alt={image.altText || `Image ${image.id}`}
                  width={200}
                  height={200}
                  objectFit="cover"
                />
                <div className={styles.mediaInfo}>
                  <p className={styles.mediaTitle}>{image.altText || `Image ${image.id}`}</p>
                  <p className={styles.mediaType}>Image</p>
                </div>
                {!selectable && (
                  <div className={styles.mediaActions}>
                    <button 
                      className={styles.deleteButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(image.id, 'image');
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Render Videos */}
          {(activeTab === 'all' || activeTab === 'video') && videos.map(video => (
            <div 
              key={`video-${video.id}`} 
              className={`${styles.mediaItem} ${selectedMedia?.item.id === video.id && selectedMedia?.type === 'video' ? styles.selected : ''}`}
              onClick={() => selectable && handleSelect(video, 'video')}
            >
              <div className={styles.mediaItemInner}>
                <div className={styles.videoThumbnail}>
                  {video.thumbnailUrl ? (
                    <Image 
                      src={video.thumbnailUrl}
                      alt={video.title || `Video ${video.id}`}
                      width={200}
                      height={200}
                      objectFit="cover"
                    />
                  ) : (
                    <div className={styles.videoPlaceholder}>
                      <span>Video</span>
                    </div>
                  )}
                  <div className={styles.videoDuration}>
                    {video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : '00:00'}
                  </div>
                </div>
                <div className={styles.mediaInfo}>
                  <p className={styles.mediaTitle}>{video.title || `Video ${video.id}`}</p>
                  <p className={styles.mediaType}>Video</p>
                </div>
                {!selectable && (
                  <div className={styles.mediaActions}>
                    <button 
                      className={styles.deleteButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(video.id, 'video');
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Show message if no media found */}
          {(images.length === 0 && videos.length === 0) && !loading && (
            <div className={styles.noMedia}>
              No media found. Upload some media to get started.
            </div>
          )}
        </div>
      )}
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            className={styles.pageButton}
            disabled={page === 1}
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {page} of {totalPages}
          </span>
          <button 
            className={styles.pageButton}
            disabled={page === totalPages}
            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
