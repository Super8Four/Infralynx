import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from './errorHandler';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err: { path: (string | number)[]; message: string }) => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        next(new AppError(JSON.stringify(errors), 400));
      } else {
        next(error);
      }
    }
  };
}; 