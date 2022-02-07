import {
    FORBIDDEN_CODE,
    NOT_FOUND_CODE,
    SERVER_ERROR_CODE,
    UNAUTHORIZED_CODE,
} from '../constants/statusCode';
import { FindOneOptions } from 'typeorm';
import Blog from '../entities/Blog';
import IPost from '../interfaces/IPost';
import { BLOG_MESSAGES } from '../constants/messages';

export default class BlogRepository {
    public getBlogsWithUser(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const blogs = await Blog.find({
                    relations: ['user'],
                    order: {
                        createdAt: 'DESC',
                    },
                });
                resolve(blogs);
            } catch ({ code, message }) {
                reject({
                    code: code,
                    statusCode: SERVER_ERROR_CODE,
                    message,
                });
            }
        });
    }

    public getBlogWithUserById(id: string | number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const blog = await Blog.findOne({
                    where: { id },
                });
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
                let blog = await this.getBlogWithUserById(data.userId);
                blog.title = data.title || blog.title;
                blog.body = data.body || blog.body;
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

    public deleteBlogById(
        userId: string | number,
        blogId: string | number
    ): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let blog = await Blog.findOne({
                    where: {
                        id: blogId,
                    },
                    relations: ['user'],
                });
                if (!blog)
                    return reject({
                        code: NOT_FOUND_CODE,
                        statusCode: NOT_FOUND_CODE,
                        message: BLOG_MESSAGES.blogNotFound,
                    });

                if (blog.userId != userId)
                    return reject({
                        code: FORBIDDEN_CODE,
                        statusCode: FORBIDDEN_CODE,
                        message: BLOG_MESSAGES.blogNotFound,
                    });

                await blog.remove();
                resolve(true);
            } catch ({ code, message }) {
                reject({
                    code: code,
                    statusCode: SERVER_ERROR_CODE,
                    message,
                });
            }
        });
    }
}
