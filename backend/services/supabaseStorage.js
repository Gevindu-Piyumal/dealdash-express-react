const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const crypto = require('crypto');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const VENDOR_BUCKET = 'vendor-logos';
const DEAL_BUCKET = 'deal-images';
const CATEGORY_BUCKET = 'category-icons';

// Ensure buckets exist
const initBuckets = async () => {
  for (const bucket of [VENDOR_BUCKET, DEAL_BUCKET, CATEGORY_BUCKET]) {
    const { data, error } = await supabase.storage.getBucket(bucket);
    
    if (error && error.statusCode === 404) {
      await supabase.storage.createBucket(bucket, {
        public: true
      });
    }
  }
};

// Initialize when the service is imported
initBuckets().catch(console.error);

// Generate unique filename for uploaded images
const generateUniqueFileName = (originalName) => {
  const extension = path.extname(originalName);
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  return `${timestamp}-${randomString}${extension}`;
};

/**
 * Upload file to Supabase storage
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} originalFilename - Original filename
 * @param {string} bucketName - Target bucket (defaults to vendor-images)
 * @returns {Promise<string>} - Public URL of uploaded file
 */
const uploadFile = async (fileBuffer, originalFilename, bucketName = VENDOR_BUCKET) => {
  const filename = generateUniqueFileName(originalFilename);
  
  // Select appropriate bucket based on file type or parameter
  let targetBucket = bucketName;
  const extension = path.extname(originalFilename).toLowerCase();
  
  const { data, error } = await supabase.storage
    .from(targetBucket)
    .upload(filename, fileBuffer, {
      contentType: getContentType(originalFilename),
      upsert: false
    });
    
  if (error) {
    throw new Error(`Error uploading file: ${error.message}`);
  }
  
  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from(targetBucket)
    .getPublicUrl(filename);
    
  return publicUrl;
};

/**
 * Delete file from Supabase storage
 * @param {string} fileUrl - File URL to delete
 */
const deleteFile = async (fileUrl) => {
  if (!fileUrl) return;
  
  // Determine bucket from URL
  let bucketName = VENDOR_BUCKET;
  if (fileUrl.includes(DEAL_BUCKET)) {
    bucketName = DEAL_BUCKET;
  } else if (fileUrl.includes(CATEGORY_BUCKET)) {
    bucketName = CATEGORY_BUCKET;
  }
  
  // Extract filename from URL
  const filename = fileUrl.split('/').pop();
  
  const { error } = await supabase.storage
    .from(bucketName)
    .remove([filename]);
    
  if (error) {
    throw new Error(`Error deleting file: ${error.message}`);
  }
};

// Helper function to get content type based on file extension
const getContentType = (filename) => {
  const extension = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml'
  };
  
  return mimeTypes[extension] || 'application/octet-stream';
};

module.exports = {
  uploadFile,
  deleteFile,
  VENDOR_BUCKET,
  DEAL_BUCKET,
  CATEGORY_BUCKET
};