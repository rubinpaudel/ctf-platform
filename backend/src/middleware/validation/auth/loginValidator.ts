import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { APIError } from '../../../utils/api-helpers/apiError';
import { ErrorValidation } from '../../../types/apiTypes/ErrorType';
import { CTFDataSource } from '../../../orm/dataSource';
import { User } from '../../../orm/entities/';

export const LoginValidator = async (req: Request, res: Response, next: NextFunction) => {
  let { Email, Password } = req.body;

  Email = !Email ? '' : Email;
  Password = !Password ? '' : Password;

  if (validator.isEmpty(Email)) {
    return next(new APIError(400, 'Validation', 'Email field is required'));
  }

  if (validator.isEmpty(Password)) {
    return next(new APIError(400, 'Validation', 'Password field is required'));
  }
  const allAdminEmails = (await CTFDataSource.getRepository(User).find({where: {isAdmin: true}})).map(user => user.Email);
  
  if(!allAdminEmails.includes(Email)){
    if (!validator.isEmail(Email)) {
      return next(new APIError(400, 'Validation', 'Email is invalid'));
    }
  }

  return next();
};