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

    public createUserProfile(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let userProfile = await UserProfile.create({});
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
}
