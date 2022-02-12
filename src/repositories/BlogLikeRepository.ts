import { SERVER_ERROR_CODE } from '../constants/statusCode';
import Like from '../entities/Like';

export default class BlogLikeRepository {
    public updateLike(data: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const { blogId, userId } = data;
                const like = await Like.findOne({
                    where: {
                        blogId,
                        userId,
                    },
                });

                if (like) {
                    like.remove();
                    return resolve({
                        unliked: true,
                        liked: false,
                    });
                }
                let blogLike = await Like.create({ blogId, userId });
                blogLike = await blogLike.save();
                return resolve({
                    unliked: false,
                    liked: true,
                });
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
