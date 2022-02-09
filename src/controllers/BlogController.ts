import { Request, Response } from 'express';
import { BLOG_MESSAGES } from '../constants/messages';
import ApiResponse from '../helpers/ApiResponse';
import Error from '../helpers/Error';
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
