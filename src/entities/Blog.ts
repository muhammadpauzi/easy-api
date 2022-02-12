import { BeforeInsert, Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import BaseModel from './BaseModel';
import { IsNotEmpty, Length } from 'class-validator';
import slugify from 'slugify';
import StringHelper from '../helpers/StringHelper';
import User from './User';
import Like from './Like';

@Entity({ name: 'blogs' })
export default class Blog extends BaseModel {
    @IsNotEmpty()
    @Length(5, 256)
    @Column({ type: 'varchar', length: 256, nullable: false })
    title!: string;

    @Column({ type: 'varchar', length: 512, nullable: false, unique: true })
    slug!: string;

    @IsNotEmpty()
    @Length(50, 10000)
    @Column({ type: 'text', nullable: false })
    body!: string;

    @Column()
    userId!: number;

    @ManyToOne(() => User, (user) => user.blogs, {
        onDelete: 'CASCADE',
        createForeignKeyConstraints: false,
    })
    user!: User;

    @OneToMany(() => Like, (like) => like.blog)
    likes!: Like[];

    @BeforeInsert()
    public async generateSlug() {
        let slug = await slugify(this.title, {
            lower: true,
        });
        const isExists = await Blog.findOne({ where: { slug } });
        if (isExists) slug = slug + (await StringHelper.getRandomKey(2, 'hex'));
        this.slug = slug;
    }
}
