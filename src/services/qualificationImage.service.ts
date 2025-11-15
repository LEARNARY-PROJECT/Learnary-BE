import { S3Client, PutObjectCommand, DeleteObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { s3Client, S3_BUCKET_NAME } from '../config/s3.config';
import path from 'path';

const QUALIFICATION_FOLDER = 'qualification_images/';
const MAX_IMAGES = 6;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

export const validateQualificationImages = (files: Express.Multer.File[]): void => {
    if (!files || files.length === 0) {
        return;
    }
    if (files.length > MAX_IMAGES) {
        throw new Error(`Maximum ${MAX_IMAGES} images allowed`);
    }
    for (const file of files) {
        if (file.size > MAX_FILE_SIZE) {
            throw new Error(`File ${file.originalname} exceeds 10MB limit`);
        }
        if (!ALLOWED_TYPES.includes(file.mimetype)) {
            throw new Error(`File ${file.originalname} must be JPG, PNG, or PDF`);
        }
    }
};

export const uploadQualificationImages = async (qualificationId: string, files: Express.Multer.File[]): Promise<string[]> => {
    if (!files || files.length === 0) {
        return [];
    }

    validateQualificationImages(files);

    const uploadPromises = files.map(async (file, index) => {
        const ext = path.extname(file.originalname);
        const key = `${QUALIFICATION_FOLDER}${qualificationId}_${index + 1}${ext}`; /* đánh số từ 1 chứ không đánh từ 0 */

        const command = new PutObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        await s3Client.send(command);

        return `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'ap-southeast-2'}.amazonaws.com/${key}`;
    });

    return Promise.all(uploadPromises);
};

export const deleteQualificationImages = async (imageUrls: string[]): Promise<void> => {
    if (!imageUrls || imageUrls.length === 0) {
        return;
    }

    const keys = imageUrls.map(url => {
        const urlParts = url.split('/');
        /* mẫu:
            url = "https://learnary-courses.s3.ap-southeast-2.amazonaws.com/qualification_images/qual_123_1.jpg"
            split ra được:
                urlParts = [
                "https:",
                "",
                "learnary-courses.s3.ap-southeast-2.amazonaws.com",
                "qualification_images",
                "qual_123_1.jpg"  // ← Phần tử cuối cùng
        ] */
        return `${QUALIFICATION_FOLDER}${urlParts[urlParts.length - 1]}`; /* lấy phần tử cuối cùng của url -> lấy tên ảnh được generate từ trước. */
    });

    const command = new DeleteObjectsCommand({
        Bucket: S3_BUCKET_NAME,
        Delete: {
            Objects: keys.map(key => ({ Key: key })),
        },
    });

    await s3Client.send(command);
};

export const deleteSingleQualificationImage = async (imageUrl: string): Promise<void> => {
    const urlParts = imageUrl.split('/');
    const key = `${QUALIFICATION_FOLDER}${urlParts[urlParts.length - 1]}`;

    const command = new DeleteObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: key,
    });

    await s3Client.send(command);
};
