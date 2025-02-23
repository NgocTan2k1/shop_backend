// libs
import express, { Application, NextFunction, Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

// middlewares
import errorHandler from './middlewares/errorHandler';
import databaseConnectionHandler from './middlewares/databaseConnecttionHandler';

// utils

// routes
import userRoutes from './routes/userRoutes';
import authenticationRoutes from './routes/authenticationRoutes';

const app: Application = express();
const port: number = 3000;

app.use(cors({ credentials: true, origin: true })); // enable CORS
app.use(bodyParser.json()); // parse JSON in req.body
app.use(cookieParser()); // parse cookies in req.cookies
app.use(express.json());

// Ver1.0.0: authentication routes
app.use(authenticationRoutes);

// Ver1.0.0: user routes
app.use(userRoutes);

/**
 * error handler
 */
app.use(errorHandler);

const server = http.createServer(app);
server.listen(port, async () => {
    // test database connection
    await databaseConnectionHandler();
    console.log(`Server is running on http://localhost:${port}`);
});
