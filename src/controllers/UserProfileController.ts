import { Response } from 'express';
import { USER_MESSAGES } from '../constants/messages';
import ApiResponse from '../helpers/ApiResponse';
import Error from '../helpers/Error';
import { IGetUserAuthInfoRequest } from '../interfaces/IGetUserAuthInfoRequest';
import UserProfileRepository from '../repositories/UserProfileRepository';

export default class UserProfileController {
    private userProfileRepository: UserProfileRepository;

    constructor() {
        this.userProfileRepository = new UserProfileRepository();
    }

    public async userProfile(req: IGetUserAuthInfoRequest, res: Response) {
        try {
            const { id: userId } = req.user;
            const userProfile =
                await this.userProfileRepository.getUserProfileById(userId);
            return ApiResponse.successResponse(res, { data: userProfile });
        } catch (error) {
            return Error.handleError(res, error);
        }
    }

    public async updateUserProfile(
        req: IGetUserAuthInfoRequest,
        res: Response
    ) {
        try {
            const { id: userId } = req.user;
            const updatedUserProfile =
                await this.userProfileRepository.updateUserProfile(
                    req.body,
                    userId
                );
            return ApiResponse.successResponse(res, {
                message: USER_MESSAGES.userProfileUpdated,
                data: updatedUserProfile,
            });
        } catch (error) {
            return Error.handleError(res, error);
        }
    }
}
