import { SERVER_ERROR_CODE } from '../constants/statusCode';
import User from '../entities/User';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import IUserProfile from '../interfaces/IUserProfile';

export default class UserRepository {
    public getUsers(options: FindManyOptions): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const users = await User.find(options);
                resolve(users);
            } catch ({ code, message }) {
                reject({
                    code: code,
                    statusCode: SERVER_ERROR_CODE,
                    message,
                });
            }
        });
    }

    public getUser(options: FindOneOptions): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await User.findOne(options);
                resolve(user);
            } catch ({ code, message }) {
                reject({
                    code: code,
                    statusCode: SERVER_ERROR_CODE,
                    message,
                });
            }
        });
    }

    public getUserById(id: string | number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await this.getUser({
                    where: {
                        id,
                    },
                    relations: ['userProfile'],
                });
                resolve(user);
            } catch (error) {
                // this error from this.getUser()
                reject(error);
            }
        });
    }

    public getUserByUsername(username: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await this.getUser({
                    where: {
                        username,
                    },
                    relations: ['userProfile'],
                });
                resolve(user);
            } catch (error) {
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
                let user = await this.getUserById(userId);

                user.userProfile.facebook =
                    data.facebook || user.userProfile.facebook;
                user.userProfile.instagram =
                    data.instagram || user.userProfile.instagram;
                user.userProfile.github =
                    data.github || user.userProfile.github;
                user.userProfile.twitter =
                    data.twitter || user.userProfile.twitter;
                user.userProfile.bio = data.bio || user.userProfile.bio;

                user.userProfile = await user.userProfile.save();
                resolve(user);
            } catch (error) {
                reject(error);
            }
        });
    }

    public updatePhotoProfile(
        filename: string,
        userId: string | number
    ): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await this.getUserById(userId);
                user.photo = filename;
                user = await user.save();
                resolve(user);
            } catch (error) {
                reject(error);
            }
        });
    }

    public updateSessionIdBy(
        options: FindOneOptions,
        sessionId: string | null
    ): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await this.getUser(options);
                user.sessionId = sessionId;
                user = await user.save();
                resolve(user);
            } catch (error) {
                reject(error);
            }
        });
    }

    public createUser(data: Object): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await User.create(data);
                user = await user.save();
                resolve(user);
            } catch ({ code, message }) {
                reject({
                    code: code,
                    statusCode: SERVER_ERROR_CODE,
                    message,
                });
            }
        });
    }
}
