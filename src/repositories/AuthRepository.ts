import { SERVER_ERROR_CODE } from '../constants/statusCode';
import User from '../entities/User';
import { FindConditions, FindOneOptions } from 'typeorm';

export default class AuthRepository {
    public getUser(options: FindOneOptions): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await User.findOne(options);
                resolve(user);
            } catch ({ message }) {
                reject({
                    code: SERVER_ERROR_CODE,
                    statusCode: SERVER_ERROR_CODE,
                    message,
                });
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
            } catch ({ code, message }) {
                reject({
                    code: code,
                    statusCode: SERVER_ERROR_CODE,
                    message,
                });
            }
        });
    }

    public createUser(data: Object): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await User.create(data);
                user = await user.save();
                resolve(user);
            } catch ({ message }) {
                reject({
                    code: SERVER_ERROR_CODE,
                    statusCode: SERVER_ERROR_CODE,
                    message,
                });
            }
        });
    }
}
