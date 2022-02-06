import dotenv from 'dotenv';
dotenv.config();
import App from './App';
import 'reflect-metadata';
import express from 'express';

import authRouter from './routes/auth';

const app = new App();

app.registerMiddleware(express.json({ limit: '10mb' }))
    .registerMiddleware(express.urlencoded({ extended: true, limit: '10mb' }))
    .registerRoute('/auth', authRouter)
    .run(5000, (port: number) => {
        console.log('Database connected!');
        console.log(`Server is running at http://127.0.0.1:${port}`);
    });
