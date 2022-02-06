import crypto from 'crypto';
import { VALIDATION_ERROR_MESSAGES } from '../constants/messages';

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

    public static upperCaseFirstLetterOfSentence = (string: string): string => {
        return string[0].toUpperCase() + string.substr(1, string.length);
    };
}
