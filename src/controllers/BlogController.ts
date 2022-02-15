import { Request, Response } from 'express';
import {
    maxThumbnailSize,
    uploadedThumbnailProfilePath,
} from '../constants/configs';
import { FILE_NOT_ALLOWED, LIMIT_FILE_SIZE } from '../constants/errorCodes';
import {
    BLOG_MESSAGES,
    SOMETHING_WENT_WRONG,
    UPLOAD_MESSAGES,
} from '../constants/messages';
import { CLIENT_ERROR_CODE, SERVER_ERROR_CODE } from '../constants/statusCode';
import ApiResponse from '../helpers/ApiResponse';
import Error from '../helpers/Error';
import Upload from '../helpers/Upload';
import { IGetUserAuthInfoRequest } from '../interfaces/IGetUserAuthInfoRequest';
import BlogRepository from '../repositories/BlogRepository';

export default class BlogController {
    private blogRepository: BlogRepository;

    constructor() {
        this.blogRepository = new BlogRepository();
    }

    public async blogs(req: Request, res: Response) {
        try {
            const blogs = await this.blogRepository.getBlogsWithUser();
            return ApiResponse.successResponse(res, { data: blogs });
        } catch (error) {
            return Error.handleError(res, error);
        }
    }

    public async blog(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const blog = await this.blogRepository.getBlogWithUserById(id);
            if (!blog)
                return ApiResponse.errorResponse(res, 404, {
                    message: BLOG_MESSAGES.blogNotFound,
                });
            return ApiResponse.successResponse(res, { data: blog });
        } catch (error) {
            return Error.handleError(res, error);
        }
    }

    public async uploadAndUpdateThumbailBlog(
        req: IGetUserAuthInfoRequest,
        res: Response
    ) {
        const storage = Upload.getDiskStorageMulter(
            uploadedThumbnailProfilePath
        );
        const upload = Upload.uploadFile(storage, maxThumbnailSize);
        upload(req, res, async (err: any) => {
            // errors handling
            if (err) {
                if (err.code == LIMIT_FILE_SIZE) {
                    return ApiResponse.errorResponse(res, CLIENT_ERROR_CODE, {
                        message: SOMETHING_WENT_WRONG,
                        errors: [UPLOAD_MESSAGES.limitFileSize],
                    });
                }

                if (err.code == FILE_NOT_ALLOWED) {
                    return ApiResponse.errorResponse(res, CLIENT_ERROR_CODE, {
                        message: '',
                    });
                }

                return ApiResponse.errorResponse(res, SERVER_ERROR_CODE, {
                    message: UPLOAD_MESSAGES.couldNotUpload,
                });
            }

            // if file doesn't exists or doesn't sent
            if (req.file === undefined) {
                return ApiResponse.errorResponse(res, CLIENT_ERROR_CODE, {
                    message: UPLOAD_MESSAGES.fileRequired,
                });
            }
            try {
                const { id: userId } = req.user;
                const { id: blogId } = req.params;
                await this.blogRepository.updateThumbnail(
                    req.file.filename,
                    blogId,
                    userId
                );
            } catch (error) {
                return Error.handleError(res, error);
            }

            return ApiResponse.successResponse(res, {
                message: UPLOAD_MESSAGES.fileSuccessfullyUploaded,
            });
        });
    }

    public async create(req: IGetUserAuthInfoRequest, res: Response) {
        try {
            const { id } = req.user;
            req.body.userId = id;
            const blog = await this.blogRepository.createBlog(req.body);
            return ApiResponse.successResponse(res, {
                message: BLOG_MESSAGES.blogCreated,
                data: blog,
            });
        } catch (error) {
            return Error.handleError(res, error);
        }
    }

    public async update(req: IGetUserAuthInfoRequest, res: Response) {
        try {
            const { id: userId } = req.user;
            const { id: blogId } = req.params;
            const data = {
                ...req.body,
                userId,
                id: blogId,
            };
            const blog = await this.blogRepository.updateBlog(data);
            return ApiResponse.successResponse(res, {
                message: BLOG_MESSAGES.blogUpdated,
                data: blog,
            });
        } catch (error) {
            return Error.handleError(res, error);
        }
    }

    public async delete(req: IGetUserAuthInfoRequest, res: Response) {
        try {
            const { id: userId } = req.user;
            const { id: blogId } = req.params;
            const blog = await this.blogRepository.deleteBlogById(
                userId,
                blogId
            );
            return ApiResponse.successResponse(res, {
                message: BLOG_MESSAGES.blogUpdated,
                data: blog,
            });
        } catch (error) {
            return Error.handleError(res, error);
        }
    }
}
