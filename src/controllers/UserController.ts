import { Request, Response } from 'express';
import ApiResponse from '../helpers/ApiResponse';
import Error from '../helpers/Error';
import UserRepository from '../repositories/UserRepository';

export default class UserController {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    public async users(req: Request, res: Response) {
        try {
            const users = await this.userRepository.getUsers({
                order: {
                    createdAt: 'DESC',
                },
            });
            return ApiResponse.successResponse(res, { data: users });
        } catch (error) {
            return Error.handleError(res, error);
        }
    }

    public async user(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const withBlogs = ['true', '1'].includes(
                <string>req.query.with_blogs
            );
            const user = await this.userRepository.getUser({
                where: {
                    id,
                },
                relations: withBlogs ? ['blogs'] : [],
                order: {
                    createdAt: 'DESC',
                },
            });
            return ApiResponse.successResponse(res, { data: user });
        } catch (error) {
            return Error.handleError(res, error);
        }
    }
}
