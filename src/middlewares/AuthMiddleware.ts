import jwt, {TokenExpiredError} from 'jsonwebtoken';
import { NO_TOKEN_PROVIDED, NO_USER_WITH_THE_TOKEN, SERVER_ERROR, THE_USER_ALREADY_LOGGED_IN, THE_USER_ALREADY_LOGGED_OUT, TOKEN_NOT_VALID } from '../constants/messages';
import User from '../entities/User';
import ApiResponse from '../helpers/ApiResponse';

export default class AuthMiddleware {
    public async verifyJwtToken(req, res, next) {
        try {
          if (!req.cookies.token)
            return ApiResponse.errorUnauthorizedResponse(res, { message: NO_TOKEN_PROVIDED });

            const { token: jwtToken } = req.cookies;
          jwt.verify(
            jwtToken,
            process.env.JWT_SECRET_KEY,
            async (err, decodedJwtToken) => {
              if (err instanceof TokenExpiredError) {
                return ApiResponse.errorUnauthorizedResponse(res, { message: NO_TOKEN_PROVIDED });
              }
      
              if (err) {
                console.log(err);
                return ApiResponse.errorUnauthorizedResponse(res, { message: TOKEN_NOT_VALID });
              }
      
              const user = await User.findOne({ where: {
                  id: decodedJwtToken.user.id
              } });
      
              if (!user)
                return ApiResponse.errorResponse(res, 404, { message: NO_USER_WITH_THE_TOKEN });
      
              if (!user.sessionId)
                return ApiResponse.errorUnauthorizedResponse(res, {
                  message: THE_USER_ALREADY_LOGGED_OUT,
                });
      
              req.user = {
                id: user.id,
                username: user.username,
              };
              next();
            }
          );
        } catch (error) {
          console.log(error);
          return ApiResponse.errorResponse(res, 500, {
            message: SERVER_ERROR,
            error_message: error.message,
          });
        }
      };

      public async blockLoggedInUser(req, res, next) {
        try {
          if (!req.cookies.token) return next();
      
          const { token: jwtToken } = req.cookies;
          jwt.verify(
            jwtToken,
            process.env.JWT_SECRET_KEY,
            async (err, decodedJwtToken) => {
              if (err) {
                console.log(err);
                return next();
              }
      
              const user = await User.findOne({ where: {
                  id: decodedJwtToken.user.id
              } });
              if (user && user?.sessionId) {
                return ApiResponse.errorResponse(res, 403, {
                  message: THE_USER_ALREADY_LOGGED_IN,
                });
              }
              return next(); // user not exists on db or jwt error must be run next() function
            }
          );
        } catch (error) {
          console.log(error);
          return ApiResponse.errorResponse(res, 500, {
            message: SERVER_ERROR,
            error_message: error.message,
          });
        }
      };
}