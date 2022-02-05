import crypto from 'crypto';

export default class StringHelper {
    public static getRandomKey(
        length: number = 20,
        encoding: string = 'base64'
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            return crypto.randomBytes(length, (error, buffer) => {
                if (error) return reject(error);
                return resolve(buffer.toString(encoding));
            });
        });
    }
}
