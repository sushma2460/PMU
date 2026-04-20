import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

interface UploadResult {
  url: string;
  error?: string;
}

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File, path: string = 'products/'): Promise<UploadResult> => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      // 1. Convert to WebP and compress
      const options = {
        maxSizeMB: 1, // Max file size 1MB
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/webp' as const, // Force WebP format
      };

      const compressedFile = await imageCompression(file, options);

      // Create a unique filename for the webp image
      const filename = `${Date.now()}_${file.name.split('.')[0]}.webp`;
      const storageRef = ref(storage, `${path}${filename}`);

      // 2. Upload to Firebase Storage
      const uploadTask = uploadBytesResumable(storageRef, compressedFile, {
        contentType: 'image/webp',
      });

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const currentProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(currentProgress);
          },
          (err) => {
            setError(err.message);
            setIsUploading(false);
            reject({ url: '', error: err.message });
          },
          async () => {
            try {
              // 3. Get download URL
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              setIsUploading(false);
              resolve({ url: downloadURL });
            } catch (err: any) {
              setError(err.message);
              setIsUploading(false);
              reject({ url: '', error: err.message });
            }
          }
        );
      });
    } catch (err: any) {
      setError(err.message);
      setIsUploading(false);
      return { url: '', error: err.message };
    }
  };

  return { uploadImage, isUploading, progress, error };
}
