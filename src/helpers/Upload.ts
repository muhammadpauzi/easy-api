import multer, { FileFilterCallback, StorageEngine } from 'multer';
import path from 'path';
import { FILE_NOT_ALLOWED } from '../constants/errorCodes';

export default class Upload {
    public static getDiskStorageMulter(uploadedPath: string) {
        return multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, uploadedPath); // the path is relative from server.js
            },
            filename: (req, file, cb) => {
                const uniquePrefix =
                    Date.now() + '_' + Math.round(Math.random() * 1000);
                // cek method file
                // console.log(file.fieldname)
                cb(null, uniquePrefix + path.extname(file.originalname));
            },
        });
    }

    public static checkFileType(
        file: Express.Multer.File,
        cb: FileFilterCallback
    ) {
        // allowed extension
        const fileTypes = /jpeg|jpg|gif|png/;
        // check ext
        const extname = fileTypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        // check mime type
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error(FILE_NOT_ALLOWED));
        }
    }

    public static uploadFile(storage: StorageEngine, fileSize: number) {
        return multer({
            storage,
            limits: {
                fileSize,
            },
            fileFilter: (req, file, cb) => {
                this.checkFileType(file, cb);
            },
        }).single('file');
    }
}
