import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';
import { requestLogger, errorLogger } from './utils/logger';
import deviceRoutes from './routes/device.routes';
import rackRoutes from './routes/rack.routes';
import siteRoutes from './routes/site.routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

// Routes
app.use('/api', apiRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/racks', rackRoutes);
app.use('/api/sites', siteRoutes);

// Error handling middleware
app.use(errorLogger);
app.use(errorHandler);
app.use(notFoundHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;