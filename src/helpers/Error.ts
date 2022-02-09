import { Response } from 'express';
import { STATUS_CODES } from 'http';
import {
    SERVER_ERROR_CODE,
    UNPROCESSABLE_ENTITY_CODE,
} from '../constants/statusCode';
import ApiResponse from './ApiResponse';

export default class Error {
    public static handleError(
        res: Response,
        error: any,
        statusCode: number = SERVER_ERROR_CODE
    ) {
        if (process.env.NODE_ENV === 'development') console.log(error);
        if (error.statusCode) statusCode = error.statusCode;
        const { code, message } = error;
        return ApiResponse.errorResponse(res, statusCode, {
            errorCode: code || statusCode,
            statusCode,
            message,
        });
    }

    public static handleValidationError(
        res: Response,
        data: Object,
        statusCode: number = UNPROCESSABLE_ENTITY_CODE
    ) {
        return ApiResponse.errorResponse(res, statusCode, data);
    }
}
