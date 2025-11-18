import { S3Client, PutObjectCommand, DeleteObjectCommand, CopyObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, S3_BUCKET_NAME } from '../config/s3.config';
import path from 'path';

const TEMPORARY_VIDEO_FOLDER = 'temporary_videos/';
const PERMANENT_VIDEO_FOLDER = 'videos/';
const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

export const validateLessonVideo = (file: Express.Multer.File): void => {
    if (!file) {
        return;
    }
    if (file.size > MAX_VIDEO_SIZE) {
        throw new Error(`Video file exceeds 500MB limit`);
    }
    if (!ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
        throw new Error(`Video must be MP4, WEBM, or MOV format`);
    }
};
const generateVideoKey = (lessonId: string, filename: string, isTemporary: boolean = true): string => {
    const ext = path.extname(filename);
    const halfId = lessonId.substring(0, Math.ceil(lessonId.length / 2));
    const folder = isTemporary ? TEMPORARY_VIDEO_FOLDER : PERMANENT_VIDEO_FOLDER;
    return `${folder}${halfId}_1${ext}`;
};
export const uploadTemporaryVideo = async (lessonId: string, file: Express.Multer.File): Promise<string> => {
    if (!file) {
        throw new Error('Video file is required');
    }
    validateLessonVideo(file);
    const key = generateVideoKey(lessonId, file.originalname, true);
    const command = new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    });
    await s3Client.send(command);
    return `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'ap-southeast-2'}.amazonaws.com/${key}`;
};
export const uploadPermanentVideo = async (lessonId: string, file: Express.Multer.File): Promise<string> => {
    if (!file) {
        throw new Error('Video file is required');
    }
    validateLessonVideo(file);
    const key = generateVideoKey(lessonId, file.originalname, false);
    const command = new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    });
    await s3Client.send(command);
    return `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'ap-southeast-2'}.amazonaws.com/${key}`;
};
const extractKeyFromUrl = (url: string): string => {
    const urlParts = url.split('/');
    // URL format: https://bucket.s3.region.amazonaws.com/folder/filename
    // lấy ra: folder/filename
    const folderIndex = urlParts.findIndex(part => part.includes('temporary_videos') || part.includes('videos'));
    return urlParts.slice(folderIndex).join('/');
};
export const moveVideoToPermanent = async (temporaryUrl: string): Promise<string> => {
    if (!temporaryUrl || !temporaryUrl.includes(TEMPORARY_VIDEO_FOLDER)) {
        throw new Error('Invalid temporary video URL');
    }
    const sourceKey = extractKeyFromUrl(temporaryUrl);
    const destinationKey = sourceKey.replace(TEMPORARY_VIDEO_FOLDER, PERMANENT_VIDEO_FOLDER);
    const copyCommand = new CopyObjectCommand({
        Bucket: S3_BUCKET_NAME,
        CopySource: `${S3_BUCKET_NAME}/${sourceKey}`,
        Key: destinationKey,
    });
    await s3Client.send(copyCommand);
    const deleteCommand = new DeleteObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: sourceKey,
    });
    await s3Client.send(deleteCommand);
    return `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'ap-southeast-2'}.amazonaws.com/${destinationKey}`;
};
export const moveVideosToPermanent = async (temporaryUrls: string[]): Promise<string[]> => {
    if (!temporaryUrls || temporaryUrls.length === 0) {
        return [];
    }
    const movePromises = temporaryUrls.map(url => moveVideoToPermanent(url));
    return Promise.all(movePromises);
};
export const deleteVideo = async (videoUrl: string): Promise<void> => {
    if (!videoUrl) {
        return;
    }
    const key = extractKeyFromUrl(videoUrl);
    const command = new DeleteObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: key,
    });
    await s3Client.send(command);
};
export const deleteVideos = async (videoUrls: string[]): Promise<void> => {
    if (!videoUrls || videoUrls.length === 0) {
        return;
    }
    const deletePromises = videoUrls.map(url => deleteVideo(url));
    await Promise.all(deletePromises);
};
export const updateVideo = async (
    lessonId: string, 
    oldVideoUrl: string | null, 
    newFile: Express.Multer.File,
    isTemporary: boolean = true
): Promise<string> => {
    if (oldVideoUrl) {
        await deleteVideo(oldVideoUrl);
    }
    if (isTemporary) {
        return uploadTemporaryVideo(lessonId, newFile);
    } else {
        return uploadPermanentVideo(lessonId, newFile);
    }
};
