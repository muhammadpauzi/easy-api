import { Request, Response } from "express";
import ApiResponse from "../helpers/ApiResponse";
import Error from "../helpers/Error";
import AuthRepository from "../repositories/AuthRepository";

export default class AuthController {
    private authRepository: AuthRepository;

    constructor() {
        this.authRepository = new AuthRepository();
    }

    public async user(req: Request, res: Response) {
        try {
            const users = await this.authRepository.getUsers();
            return ApiResponse.successResponse(res, { data: users });
        } catch (error) {
            return Error.handleError(res, error);
        }
    }
}