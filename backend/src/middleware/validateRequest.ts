import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Return friendly validation error
        res.status(400).json({
          success: false,
          field: error.errors[0].path.join('.'),
          message: error.errors[0].message
        });
        return;
      }
      res.status(500).json({ success: false, message: 'Internal server validation error' });
    }
  };
};
