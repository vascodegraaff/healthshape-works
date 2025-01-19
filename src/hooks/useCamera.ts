import { useCallback } from 'react';

export const useCamera = () => {
  const startCamera = useCallback(async (videoElement: HTMLVideoElement) => {
    try {
      console.log('Requesting camera access...');
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera access granted');

      videoElement.srcObject = stream;
      
      // Wait for the video to be ready
      return new Promise<void>((resolve, reject) => {
        videoElement.onloadedmetadata = () => {
          videoElement.play()
            .then(() => {
              console.log('Video playback started');
              resolve();
            })
            .catch(reject);
        };
        videoElement.onerror = reject;
      });
    } catch (error) {
      console.error('Camera access error:', error);
      throw error;
    }
  }, []);

  const stopCamera = useCallback((videoElement: HTMLVideoElement) => {
    try {
      const stream = videoElement.srcObject as MediaStream | null;
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
          console.log('Camera track stopped');
        });
        videoElement.srcObject = null;
      }
    } catch (error) {
      console.error('Error stopping camera:', error);
    }
  }, []);

  return { startCamera, stopCamera };
}; 