import { Request, Response, NextFunction } from 'express';
import { APIError } from '../utils/api-helpers/apiError';

export const CheckAdmin = (req: Request, res: Response, next: NextFunction) => {

  const { isAdmin } = req.body.jwtPayload;

  if (!isAdmin) {
    const UnauthorizedError = new APIError(401, 'Unauthorized', 'Unauthorized - Insufficient user rights');
    next(UnauthorizedError);
  }
  return next();

};