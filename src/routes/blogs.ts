import { Router } from 'express';
import BlogController from '../controllers/BlogController';
import { IGetUserAuthInfoRequest } from '../interfaces/IGetUserAuthInfoRequest';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import BlogMiddleware from '../middlewares/BlogMiddleware';

const router = Router();
const blogController = new BlogController();
const { verifyJwtToken } = new AuthMiddleware();
const { validateBlog } = new BlogMiddleware();

router.get('/', (req, res) => blogController.blogs(req, res));
router.post(
    '/create',
    validateBlog,
    (req, ...args) => verifyJwtToken(<IGetUserAuthInfoRequest>req, ...args),
    (req, res) => blogController.create(<IGetUserAuthInfoRequest>req, res)
);
router.get('/:id', (req, res) => blogController.blog(req, res));
router.put(
    '/:id/update',
    validateBlog,
    (req, ...args) => verifyJwtToken(<IGetUserAuthInfoRequest>req, ...args),
    (req, res) => blogController.update(<IGetUserAuthInfoRequest>req, res)
);
router.delete(
    '/:id/delete',
    (req, ...args) =>
        verifyJwtToken(<IGetUserAuthInfoRequest>(<unknown>req), ...args),
    (req, res) =>
        blogController.delete(<IGetUserAuthInfoRequest>(<unknown>req), res)
);

export default router;
