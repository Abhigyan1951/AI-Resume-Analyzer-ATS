import api from './api';

/**
 * Service to upload PDF resume to POST /api/resume/upload
 * Supports onUploadProgress callback for progress bar tracking.
 */
export const uploadResumeFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await api.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });

  return response.data;
};

export default {
  uploadResumeFile,
};
