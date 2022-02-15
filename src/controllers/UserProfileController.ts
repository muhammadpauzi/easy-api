import { Request, Response } from 'express';
import { maxPhotoSize, uploadedPhotoProfilePath } from '../constants/configs';
import { FILE_NOT_ALLOWED, LIMIT_FILE_SIZE } from '../constants/errorCodes';
import {
    SOMETHING_WENT_WRONG,
    UPLOAD_MESSAGES,
    USER_MESSAGES,
} from '../constants/messages';
import { CLIENT_ERROR_CODE, SERVER_ERROR_CODE } from '../constants/statusCode';
import ApiResponse from '../helpers/ApiResponse';
import Error from '../helpers/Error';
import Upload from '../helpers/Upload';
import { IGetUserAuthInfoRequest } from '../interfaces/IGetUserAuthInfoRequest';
import UserProfileRepository from '../repositories/UserProfileRepository';
import UserRepository from '../repositories/UserRepository';

export default class UserProfileController {
    private userProfileRepository: UserProfileRepository;
    private userRepository: UserRepository;

    constructor() {
        this.userProfileRepository = new UserProfileRepository();
        this.userRepository = new UserRepository();
    }

    public async userProfile(req: IGetUserAuthInfoRequest, res: Response) {
        try {
            const { id: userId } = req.user;
            const { userProfile } = await this.userRepository.getUserById(
                userId
            );
            return ApiResponse.successResponse(res, { data: userProfile });
        } catch (error) {
            return Error.handleError(res, error);
        }
    }

    public async uploadAndUpdateUserPhotoProfile(
        req: IGetUserAuthInfoRequest,
        res: Response
    ) {
        const storage = Upload.getDiskStorageMulter(uploadedPhotoProfilePath);
        const upload = Upload.uploadFile(storage, maxPhotoSize);
        const { id: userId } = req.user;
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
                await this.userRepository.updatePhotoProfile(
                    req.file.filename,
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

    public async updateUserProfile(
        req: IGetUserAuthInfoRequest,
        res: Response
    ) {
        try {
            const { id: userId } = req.user;
            const { userProfile: updatedUserProfile } =
                await this.userRepository.updateUserProfile(req.body, userId);
            return ApiResponse.successResponse(res, {
                message: USER_MESSAGES.userProfileUpdated,
                data: updatedUserProfile,
            });
        } catch (error) {
            return Error.handleError(res, error);
        }
    }
}
