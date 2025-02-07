// libs
import express, { Application, NextFunction, Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

// middlewares
import errorHandler from './middlewares/errorHandler';

// utils

// routes
import userRoutes from './routes/userRoutes';

const app: Application = express();
const port: number = 3000;

app.use(cors({ credentials: true, origin: true })); // enable CORS
app.use(bodyParser.json()); // parse JSON in req.body
app.use(cookieParser()); // parse cookies in req.cookies
app.use(express.json());

// users
app.use(userRoutes);

/**
 * error handler
 */
app.use(errorHandler);

const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
