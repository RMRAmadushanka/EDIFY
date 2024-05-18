/**
 * AWS S3 service
 */
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as httpStatus from 'http-status';
//
import ApiError from '../utils/api-error.js';
/**
 * S3 client credentials
 */
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  region: process.env.S3_REGION,
});
/**
 * Function to asynchronously upload files to S3
 */
export const uploadFiles = async (attachedFiles, folderName) => {
  try {
    const promises = attachedFiles.map(async (file) => {
      return new Promise(async (resolve, reject) => {
        try {
          const url = await uploadToS3(file.originalname, file.mimetype, file.buffer, folderName);
          resolve({
            name: file.originalname,
            url,
          });
        } catch (err) {
          reject(err);
        }
      });
    });
    //
    const files = Promise.all(promises);
    //
    return files;
  } catch {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Internal server error');
  }
};
/**
 * Function to upload a single file to S3
 */
export const uploadToS3 = async (name, type, buffer, folderName) => {
  const uniqueName = `${folderName}/${uuidv4()}-${name}`;
  //
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Body: buffer,
    Key: uniqueName,
    ContentType: type,
    ACL: 'public-read',
  };
  //
  const command = new PutObjectCommand(params);
  //
  await s3.send(command);
  return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${uniqueName}`;
};

/**
 * Function to delete a file from S3
 */
export const deleteFromS3 = async (parameters) => {
  const prefixedKey = `product_images/${parameters.objectId}`;
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: prefixedKey,
  };

  try {
    const command = new DeleteObjectCommand(params);
   await s3.send(command);
    return parameters.name;
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error deleting file from S3');
  }
};