import dotenv from 'dotenv';
dotenv.config();
import App from './App';
import 'reflect-metadata';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import blogsRouter from './routes/blogs';
import blogLikesRouter from './routes/blogLikes';
import userProfilesRouter from './routes/userProfiles';
import { join } from 'path';

const app = new App();

app.registerMiddleware(
    cors({
        origin: ['http://localhost:3000'],
        credentials: true,
    })
)
    .registerMiddleware(express.json({ limit: '10mb' }))
    .registerMiddleware(express.static(join(__dirname, '../', '/public')))
    .registerMiddleware(express.urlencoded({ extended: true, limit: '10mb' }))
    .registerMiddleware(cookieParser(process.env.COOKIE_PARSER_SECRET_KEY))
    .registerRoute('/users', usersRouter)
    .registerRoute('/auth', authRouter)
    .registerRoute('/blogs', blogsRouter)
    .registerRoute('/blogs', blogLikesRouter)
    .registerRoute('/profile', userProfilesRouter)
    .run(5000, (port: number) => {
        console.log('Database connected!');
        console.log(`Server is running at http://127.0.0.1:${port}`);
    });
