import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { toast } from 'sonner';

interface UploadResult {
  url: string;
  error?: string;
}

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File, path: string = 'products/'): Promise<UploadResult> => {
    setIsUploading(true);
    setIsProcessing(true);
    setProgress(0);
    setError(null);

    let fileToUpload: File | Blob = file;

    try {
      // 1. Attempt rapid compression
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1000,
        useWebWorker: true,
        fileType: 'image/webp' as const,
        initialQuality: 0.6,
      };

      try {
        fileToUpload = await imageCompression(file, options);
      } catch (compressionErr) {
        console.warn("Compression failed, falling back to original file:", compressionErr);
        // Fallback to original file if compression fails or takes too long
        fileToUpload = file;
      }
      
      setIsProcessing(false);

      // Create a unique filename
      const extension = fileToUpload.type.split('/')[1] || 'jpg';
      const filename = `${Date.now()}_${file.name.split('.')[0]}.${extension}`;
      const storageRef = ref(storage, `${path}${filename}`);

      // 2. Upload to Firebase Storage
      const uploadTask = uploadBytesResumable(storageRef, fileToUpload, {
        contentType: fileToUpload.type,
      });

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const currentProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(currentProgress);
          },
          (err) => {
            console.error("Firebase Storage Error:", err);
            setError(err.message);
            setIsUploading(false);
            toast.error("Cloud Storage Error: " + err.message);
            reject({ url: '', error: err.message });
          },
          async () => {
            try {
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
      console.error("Upload process failed:", err);
      setError(err.message);
      setIsProcessing(false);
      setIsUploading(false);
      return { url: '', error: err.message };
    }
  };

  return { uploadImage, isUploading, isProcessing, progress, error };
}
