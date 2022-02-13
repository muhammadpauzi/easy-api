import { SERVER_ERROR_CODE } from '../constants/statusCode';
import { FindOneOptions } from 'typeorm';
import IUserProfile from '../interfaces/IUserProfile';
import UserProfile from '../entities/UserProfile';

export default class UserProfileRepository {
    public getUserProfile(options: FindOneOptions): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const userProfile = await UserProfile.findOne(options);
                resolve(userProfile);
            } catch ({ code, message }) {
                reject({
                    code: code,
                    statusCode: SERVER_ERROR_CODE,
                    message,
                });
            }
        });
    }

    public createUserProfile(userId: number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let userProfile = await UserProfile.create({
                    userId,
                });
                userProfile = await userProfile.save();
                resolve(userProfile);
            } catch ({ code, message }) {
                reject({
                    code: code,
                    statusCode: SERVER_ERROR_CODE,
                    message,
                });
            }
        });
    }

    public getUserProfileById(userId: string | number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const userProfile = await this.getUserProfile({
                    where: {
                        userId,
                    },
                });
                resolve(userProfile);
            } catch (error) {
                // this error from this.getUser()
                reject(error);
            }
        });
    }

    public updateUserProfile(
        data: IUserProfile,
        userId: string | number
    ): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let userProfile = await this.getUserProfileById(userId);

                userProfile.facebook = data.facebook || userProfile.facebook;
                userProfile.instagram = data.instagram || userProfile.instagram;
                userProfile.github = data.github || userProfile.github;
                userProfile.twitter = data.twitter || userProfile.twitter;
                userProfile.bio = data.bio || userProfile.bio;

                userProfile = await userProfile.save();
                resolve(userProfile);
            } catch (error) {
                reject(error);
            }
        });
    }
}
