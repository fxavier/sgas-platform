import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import {
  AWS_REGION,
  AWS_S3_BUCKET,
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
} from './aws-config';

// Initialize S3 client
const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY!,
    secretAccessKey: AWS_SECRET_KEY!,
  },
});

/**
 * Uploads a file to S3 and returns the URL
 * @param file The file to upload
 * @returns The URL of the uploaded file
 */
export async function uploadFileToS3(file: File): Promise<string> {
  try {
    console.log('Uploading file to S3:', file.name, file.size, file.type);

    // Get file extension
    const fileName = file.name;
    const fileExt = fileName.split('.').pop();

    // Generate a unique file name
    const key = `uploads/${uuidv4()}.${fileExt}`;
    console.log('Generated key:', key);

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log('S3 upload parameters:', {
      bucket: AWS_S3_BUCKET,
      contentType: file.type,
      fileSize: buffer.length,
    });

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: AWS_S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    // Return the URL
    const fileUrl = `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;
    console.log('File uploaded successfully:', fileUrl);

    return fileUrl;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error(
      `Failed to upload file: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

/**
 * Extracts the key from a S3 URL
 * @param url The S3 URL
 * @returns The S3 key
 */
export function getKeyFromUrl(url: string): string | null {
  try {
    console.log('Extracting key from URL:', url);

    // Check if it's an S3 URL
    if (!url || !url.includes(AWS_S3_BUCKET!)) {
      console.warn('Not an S3 URL:', url);
      return null;
    }

    // Extract the key part
    const urlObj = new URL(url);
    const key = urlObj.pathname.startsWith('/')
      ? urlObj.pathname.substring(1)
      : urlObj.pathname;

    console.log('Extracted key:', key);
    return key;
  } catch (error) {
    console.error('Error extracting key from URL:', error);
    return null;
  }
}

/**
 * Deletes a file from S3
 * @param key The S3 key
 */
export async function deleteFromS3(key: string): Promise<void> {
  try {
    console.log('Deleting file from S3:', key);

    const command = new DeleteObjectCommand({
      Bucket: AWS_S3_BUCKET,
      Key: key,
    });

    await s3Client.send(command);
    console.log('File deleted successfully');
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw new Error(
      `Failed to delete file: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

// Alias for backward compatibility
export const uploadToS3 = uploadFileToS3;

/**
 * Debugging function to check if AWS credentials are properly configured
 */
export function checkAwsConfig() {
  console.log('AWS Region:', AWS_REGION);
  console.log('AWS S3 Bucket:', AWS_S3_BUCKET ? 'Set' : 'Not set');
  console.log('AWS Access Key:', AWS_ACCESS_KEY ? 'Set' : 'Not set');
  console.log('AWS Secret Key:', AWS_SECRET_KEY ? 'Set' : 'Not set');

  if (!AWS_S3_BUCKET || !AWS_ACCESS_KEY || !AWS_SECRET_KEY) {
    console.error('Missing required AWS environment variables');
    return false;
  }

  return true;
}
