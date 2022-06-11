import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { APIError } from '../../../utils/api-helpers/apiError';
import { ErrorValidation } from '../../../types/apiTypes/ErrorType';
import { isAllowedEmail } from '../../../utils/api-helpers/auth/isAllowedEmail';
import { allowedEmail } from '../../../utils/api-helpers/auth/allowedEmail';
import { UserAccountConstants } from '../../../consts/UserAccount';


export const RegisterValidator = async (req: Request, res: Response, next: NextFunction) => {
  let { Email, Password, PasswordConfirm } = req.body;

  Email = !Email ? '' : Email;
  Password = !Password ? '' : Password;
  PasswordConfirm = !PasswordConfirm ? '' : PasswordConfirm;

  if (validator.isEmpty(Email)) {
    return next(new APIError(400,'Validation', 'Email is required'));
  }

  if (!validator.isEmail(Email)) {
    return next(new APIError(400,'Validation', 'Email is invalid'));
  }

  if (!(await isAllowedEmail(Email))) {
    return next(new APIError(400,'Validation', 'Allowed Domains: '+ (await allowedEmail()).toString()));
  }

  if (validator.isEmpty(Password)) {
    return next(new APIError(400,'Validation', 'Password is required'));
  }

  if (!validator.isLength(Password, { min: UserAccountConstants.MIN_PASSWORD_LENGTH })) {
    return next(new APIError(400,'Validation', `Password must be at least ${UserAccountConstants.MIN_PASSWORD_LENGTH} characters`));
  }

  if (validator.isEmpty(PasswordConfirm)) {
    return next(new APIError(400,'Validation', 'Confirm Password is required'));
  }

  if (!validator.equals(Password, PasswordConfirm)) {
    return next(new APIError(400,'Validation', 'Passwords must match'));
  }

  return next();
};