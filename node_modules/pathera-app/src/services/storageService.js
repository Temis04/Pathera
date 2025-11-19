// Storage service for Supabase file uploads
import { supabase } from '../lib/supabase';

/**
 * Upload a file to Supabase Storage
 * @param {string} bucket - Bucket name
 * @param {string} path - File path in bucket
 * @param {File} file - File object to upload
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const uploadFile = async (bucket, path, file) => {
  try {
    // TODO: Integrate with Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { data: null, error };
  }
};

/**
 * Download a file from Supabase Storage
 * @param {string} bucket - Bucket name
 * @param {string} path - File path in bucket
 * @returns {Promise<{data: Blob|null, error: Error|null}>}
 */
export const downloadFile = async (bucket, path) => {
  try {
    // TODO: Integrate with Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error downloading file:', error);
    return { data: null, error };
  }
};

/**
 * Get public URL for a file
 * @param {string} bucket - Bucket name
 * @param {string} path - File path in bucket
 * @returns {string} Public URL
 */
export const getPublicUrl = (bucket, path) => {
  // TODO: Integrate with Supabase Storage
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
};

/**
 * Delete a file from Supabase Storage
 * @param {string} bucket - Bucket name
 * @param {string} path - File path in bucket
 * @returns {Promise<{error: Error|null}>}
 */
export const deleteFile = async (bucket, path) => {
  try {
    // TODO: Integrate with Supabase Storage
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { error };
  }
};

/**
 * List files in a folder
 * @param {string} bucket - Bucket name
 * @param {string} folder - Folder path
 * @returns {Promise<{files: Array|null, error: Error|null}>}
 */
export const listFiles = async (bucket, folder = '') => {
  try {
    // TODO: Integrate with Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) throw error;
    return { files: data, error: null };
  } catch (error) {
    console.error('Error listing files:', error);
    return { files: null, error };
  }
};

/**
 * Upload CV file for a user
 * @param {string} userId - User's ID
 * @param {File} file - CV file
 * @returns {Promise<{url: string|null, error: Error|null}>}
 */
export const uploadCV = async (userId, file) => {
  const timestamp = Date.now();
  const fileName = `${userId}/cv_${timestamp}.${file.name.split('.').pop()}`;
  
  const { data, error } = await uploadFile('cv-uploads', fileName, file);
  
  if (error) {
    return { url: null, error };
  }
  
  // Get the URL for the uploaded file
  const url = getPublicUrl('cv-uploads', fileName);
  return { url, error: null };
};

/**
 * Upload profile picture for a user
 * @param {string} userId - User's ID
 * @param {File} file - Image file
 * @returns {Promise<{url: string|null, error: Error|null}>}
 */
export const uploadProfilePicture = async (userId, file) => {
  const fileName = `${userId}/profile.${file.name.split('.').pop()}`;
  
  // Delete old profile picture if exists
  await deleteFile('profile-pictures', fileName);
  
  const { data, error } = await uploadFile('profile-pictures', fileName, file);
  
  if (error) {
    return { url: null, error };
  }
  
  const url = getPublicUrl('profile-pictures', fileName);
  return { url, error: null };
};

/**
 * Upload personal statement file
 * @param {string} userId - User's ID
 * @param {File} file - Personal statement file
 * @returns {Promise<{url: string|null, error: Error|null}>}
 */
export const uploadPersonalStatement = async (userId, file) => {
  const timestamp = Date.now();
  const fileName = `${userId}/statement_${timestamp}.${file.name.split('.').pop()}`;
  
  const { data, error } = await uploadFile('personal-statements', fileName, file);
  
  if (error) {
    return { url: null, error };
  }
  
  const url = getPublicUrl('personal-statements', fileName);
  return { url, error: null };
};

/**
 * Upload supporting document
 * @param {string} userId - User's ID
 * @param {File} file - Supporting document file
 * @param {string} documentType - Type of document (certificate, transcript, etc.)
 * @returns {Promise<{url: string|null, error: Error|null}>}
 */
export const uploadSupportingDocument = async (userId, file, documentType) => {
  const timestamp = Date.now();
  const fileName = `${userId}/${documentType}_${timestamp}.${file.name.split('.').pop()}`;
  
  const { data, error } = await uploadFile('supporting-documents', fileName, file);
  
  if (error) {
    return { url: null, error };
  }
  
  const url = getPublicUrl('supporting-documents', fileName);
  return { url, error: null };
};

/**
 * Get user's uploaded CVs
 * @param {string} userId - User's ID
 * @returns {Promise<{files: Array|null, error: Error|null}>}
 */
export const getUserCVs = async (userId) => {
  return await listFiles('cv-uploads', userId);
};

/**
 * Get user's personal statements
 * @param {string} userId - User's ID
 * @returns {Promise<{files: Array|null, error: Error|null}>}
 */
export const getUserPersonalStatements = async (userId) => {
  return await listFiles('personal-statements', userId);
};

/**
 * Get user's supporting documents
 * @param {string} userId - User's ID
 * @returns {Promise<{files: Array|null, error: Error|null}>}
 */
export const getUserSupportingDocuments = async (userId) => {
  return await listFiles('supporting-documents', userId);
};

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  } = options;

  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB` 
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Invalid file type. Please upload a PDF or Word document.' 
    };
  }

  return { valid: true, error: null };
};

/**
 * Validate image file before upload
 * @param {File} file - Image file to validate
 * @param {number} maxSize - Max file size in bytes
 * @returns {Object} Validation result
 */
export const validateImage = (file, maxSize = 2 * 1024 * 1024) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `Image size must be less than ${Math.round(maxSize / 1024 / 1024)}MB` 
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Invalid image type. Please upload JPG, PNG, or WebP.' 
    };
  }

  return { valid: true, error: null };
};
