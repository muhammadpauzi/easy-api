import { Router } from 'express';
import BlogController from '../controllers/BlogController';
import { IGetUserAuthInfoRequest } from '../interfaces/IGetUserAuthInfoRequest';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import BlogMiddleware from '../middlewares/BlogMiddleware';
import StringMiddleware from '../middlewares/StringMiddleware';

const router = Router();
const blogController = new BlogController();
const { verifyJwtToken } = new AuthMiddleware();
const { trimRequestBody } = new StringMiddleware();
const { validateBlog } = new BlogMiddleware();

router.get('/', (req, res) => blogController.blogs(req, res));
router.post(
    '/',
    trimRequestBody,
    validateBlog,
    (req, ...args) => verifyJwtToken(<IGetUserAuthInfoRequest>req, ...args),
    (req, res) => blogController.create(<IGetUserAuthInfoRequest>req, res)
);
router.get('/:id', (req, res) => blogController.blog(req, res));
router.put(
    '/:id',
    trimRequestBody,
    validateBlog,
    (req, ...args) => verifyJwtToken(<IGetUserAuthInfoRequest>req, ...args),
    (req, res) => blogController.update(<IGetUserAuthInfoRequest>req, res)
);
router.delete(
    '/:id',
    (req, ...args) =>
        verifyJwtToken(<IGetUserAuthInfoRequest>(<unknown>req), ...args),
    (req, res) =>
        blogController.delete(<IGetUserAuthInfoRequest>(<unknown>req), res)
);

export default router;
