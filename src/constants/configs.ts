import { join } from 'path';

export const maxPhotoSize = 2 * 1024 * 1024; // 2MB
export const uploadBaseDirectoryPath = join(
    __dirname,
    '../../public/',
    'uploads'
);
export const uploadedPhotoProfilePath = join(
    uploadBaseDirectoryPath,
    '/photos/'
);

export const maxThumbnailSize = 2 * 1024 * 1024; // 2MB
export const uploadedThumbnailProfilePath = join(
    uploadBaseDirectoryPath,
    '/thumbnails/'
);
