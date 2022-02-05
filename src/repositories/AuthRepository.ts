import { SERVER_ERROR_CODE } from '../constants/statusCode';
import User from '../entities/User';
import { FindOneOptions } from 'typeorm';

export default class AuthRepository {
    public getUser(options: FindOneOptions): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await User.findOne(options);
                resolve(user);
            } catch (error: any) {
                reject({
                    code: SERVER_ERROR_CODE,
                    statusCode: SERVER_ERROR_CODE,
                    message: error.message,
                });
            }
        });
    }

    public updateSessionIdByUsername(
        username: string,
        sessionId: string
    ): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await User.update(
                    { username },
                    {
                        sessionId,
                    }
                );
                resolve(user);
            } catch (error: any) {
                reject({
                    code: SERVER_ERROR_CODE,
                    statusCode: SERVER_ERROR_CODE,
                    message: error.message,
                });
            }
        });
    }

    public createUser(data: Object): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await User.insert(data);
                resolve(user);
            } catch (error: any) {
                reject({
                    code: SERVER_ERROR_CODE,
                    statusCode: SERVER_ERROR_CODE,
                    message: error.message,
                });
            }
        });
    }
}
