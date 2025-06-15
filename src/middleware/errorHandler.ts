import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError | Prisma.PrismaClientKnownRequestError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle Prisma errors
    if (err.code === 'P2002') {
      return res.status(409).json({
        status: 'fail',
        message: 'A record with this value already exists',
      });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({
        status: 'fail',
        message: 'Record not found',
      });
    }
  }

  // Default error
  console.error('ERROR 💥', err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
}; 