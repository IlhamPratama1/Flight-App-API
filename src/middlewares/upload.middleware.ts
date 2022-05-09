import { Request } from 'express';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function(req: Request, file: Express.Multer.File, cb) {
        cb(null, './static/images');
    },
    filename: function(req: Request, file: Express.Multer.File, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

export const uploadImage = multer({ 
    storage: storage,
    fileFilter: (req: Request, file: Express.Multer.File, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg")
            cb(null, true);
        else
            cb(null, false);
    }
}).single('image');

