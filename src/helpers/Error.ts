import { Response } from "express";
import ApiResponse from "./ApiResponse";

export default class Error {
    public static handleError(res: Response, error: any, statusCode: number = 500) {
        console.log(error);
        const { code, message } = error;
        return ApiResponse.errorResponse(res, statusCode, { errorCode: code, message });
    }
}