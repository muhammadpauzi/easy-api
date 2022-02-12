import {
    FORBIDDEN_CODE,
    NOT_FOUND_CODE,
    SERVER_ERROR_CODE,
} from '../constants/statusCode';
import Blog from '../entities/Blog';
import IPost from '../interfaces/IPost';
import { AUTH_MESSAGES, BLOG_MESSAGES } from '../constants/messages';

export default class BlogRepository {
    public getBlogsWithUser(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const blogs = await Blog.find({
                    relations: ['user', 'likes'],
                    order: {
                        createdAt: 'DESC',
                    },
                });
                resolve(blogs);
            } catch (error) {
                reject(error);
            }
        });
    }

    public getBlogWithUserById(id: string | number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const blog = await Blog.findOne({
                    where: { id },
                    relations: ['user', 'likes'],
                });

                if (!blog)
                    return reject({
                        code: NOT_FOUND_CODE,
                        statusCode: NOT_FOUND_CODE,
                        message: BLOG_MESSAGES.blogNotFound,
                    });

                resolve(blog);
            } catch (error) {
                reject(error);
            }
        });
    }

    public createBlog(data: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const { title, body, userId } = data;
                let blog = await Blog.create({ title, body, userId });
                blog = await blog.save();
                resolve(blog);
            } catch ({ code, message }) {
                reject({
                    code: code,
                    statusCode: SERVER_ERROR_CODE,
                    message,
                });
            }
        });
    }

    public updateBlog(data: IPost): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let blog = await this.getBlogWithUserById(data.id);
                if (blog.userId != data.userId)
                    return reject({
                        code: FORBIDDEN_CODE,
                        statusCode: FORBIDDEN_CODE,
                        message: AUTH_MESSAGES.dontHavePermission,
                    });

                blog.title = data.title || blog.title;
                blog.body = data.body || blog.body;
                blog = await blog.save();
                resolve(blog);
            } catch (error) {
                reject(error);
            }
        });
    }

    public deleteBlogById(
        userId: string | number,
        blogId: string | number
    ): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let blog = await this.getBlogWithUserById(blogId);

                if (blog.userId != userId)
                    return reject({
                        code: FORBIDDEN_CODE,
                        statusCode: FORBIDDEN_CODE,
                        message: AUTH_MESSAGES.dontHavePermission,
                    });

                await blog.remove();
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    }
}
