const upload = multer({ storage: multer.memoryStorage() });
export const uploadMiddleware = upload.single("image");