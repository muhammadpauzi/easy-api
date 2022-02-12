import { Column, Entity, ManyToOne } from 'typeorm';
import BaseModel from './BaseModel';
import Blog from './Blog';

@Entity({ name: 'likes' })
export default class Like extends BaseModel {
    @Column()
    blogId!: number;

    @Column()
    userId!: number;

    @ManyToOne(() => Blog, (blog) => blog.likes, {
        onDelete: 'CASCADE',
        createForeignKeyConstraints: false,
    })
    blog!: Blog;
}
