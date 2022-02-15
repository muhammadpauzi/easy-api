import { Router } from 'express';
import UserProfileController from '../controllers/UserProfileController';
import { IGetUserAuthInfoRequest } from '../interfaces/IGetUserAuthInfoRequest';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import StringMiddleware from '../middlewares/StringMiddleware';
import UserProfileMiddleware from '../middlewares/UserProfileMiddleware';

const router = Router();
const userProfileController = new UserProfileController();
const { validateUserProfile } = new UserProfileMiddleware();
const { trimRequestBody } = new StringMiddleware();
const { verifyJwtToken } = new AuthMiddleware();

router.get(
    '/',
    (req, ...args) => verifyJwtToken(<IGetUserAuthInfoRequest>req, ...args),
    (req, res) =>
        userProfileController.userProfile(<IGetUserAuthInfoRequest>req, res)
);

router.put(
    '/',
    trimRequestBody,
    validateUserProfile,
    (req, ...args) => verifyJwtToken(<IGetUserAuthInfoRequest>req, ...args),
    (req, res) =>
        userProfileController.updateUserProfile(
            <IGetUserAuthInfoRequest>req,
            res
        )
);

router.post(
    '/photo',
    (req, ...args) => verifyJwtToken(<IGetUserAuthInfoRequest>req, ...args),
    (req, res) =>
        userProfileController.uploadAndUpdateUserPhotoProfile(
            <IGetUserAuthInfoRequest>req,
            res
        )
);

export default router;
