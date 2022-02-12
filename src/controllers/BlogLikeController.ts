import { Response } from 'express';
import { BLOG_LIKE_MESSAGES } from '../constants/messages';
import ApiResponse from '../helpers/ApiResponse';
import Error from '../helpers/Error';
import { IGetUserAuthInfoRequest } from '../interfaces/IGetUserAuthInfoRequest';
import BlogLikeRepository from '../repositories/BlogLikeRepository';

export default class BlogLikeController {
    private blogLikeRepository: BlogLikeRepository;

    constructor() {
        this.blogLikeRepository = new BlogLikeRepository();
    }

    public async like(req: IGetUserAuthInfoRequest, res: Response) {
        try {
            const { id: userId } = req.user;
            const { id: blogId } = req.params;
            const data = {
                blogId,
                userId,
            };
            const like = await this.blogLikeRepository.updateLike(data);
            if (like.liked)
                return ApiResponse.successCreatedResponse(res, {
                    message: BLOG_LIKE_MESSAGES.blogLiked,
                    data: like,
                });

            return ApiResponse.successResponse(res, {
                message: BLOG_LIKE_MESSAGES.blogUnliked,
                data: like,
            });
        } catch (error) {
            return Error.handleError(res, error);
        }
    }
}
