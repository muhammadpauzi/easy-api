import { SERVER_ERROR_CODE } from "../constants/statusCode";
import User from "../entities/User";

export default class AuthRepository {
    public getUsers(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const users = await User.find({ order: { createdAt: "DESC" }, relations: ['posts'] });
                resolve(users);
            } catch (error: any) {
                reject({ code: SERVER_ERROR_CODE, message: error.message });
            }
        })
    }
}