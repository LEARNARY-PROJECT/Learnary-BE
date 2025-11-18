import multer from "multer";

const storage = multer.memoryStorage();

//image upload config (cho image)
const upload = multer({
    storage,
    limits: { 
        fileSize: 10 * 1024 * 1024 // 10MB
    },
    fileFilter: (_, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file ảnh'));
        }
    }
});

// video upload config (cho lessons)
export const videoUpload = multer({
    storage,
    limits: { 
        fileSize: 500 * 1024 * 1024 // 500MB
    },
    fileFilter: (_, file, cb) => {
        const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận video MP4, WEBM, hoặc MOV'));
        }
    }
});

export default upload;