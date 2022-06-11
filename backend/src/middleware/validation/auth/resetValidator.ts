import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { APIError } from '../../../utils/api-helpers/apiError';
import { isAllowedEmail } from '../../../utils/api-helpers/auth/isAllowedEmail';
import { UserAccountConstants } from '../../../consts/UserAccount';


export const ResetValidator = async (req: Request, res: Response, next: NextFunction) => {
  let { Password, PasswordConfirm } = req.body;

  Password = !Password ? '' : Password;
  PasswordConfirm = !PasswordConfirm ? '' : PasswordConfirm;

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