import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage=multer.diskStorage({
    destination: uploadDir,
    filename:(req,file,cb)=>{
        const uniqueName= `${Date.now()}-${file.originalname}`;
        cb(null,uniqueName);
    }
});

const fileFilter=(req,file,cb)=>{
    const allowedTypes=[
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'text/plain'
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});
