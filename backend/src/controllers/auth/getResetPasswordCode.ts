import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { User } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';
import { randomUUID } from 'crypto';
import { sendResetPasswordEmail } from '../../utils/mails/sendResetPasswordEmail';

export const GetResetPasswordCode = async (req: Request, res : Response, next : NextFunction) => {

    const Email = req.params.email;

    const UserRepository = CTFDataSource.getRepository(User);

    try {
        
        const user = await UserRepository.findOneBy({Email: Email});

        if (user == null) {
            const UserNotFoundError = new APIError(404, 'General', `No user found with email`);
            return next(UserNotFoundError);
        }

        if (user.Active == false) {
            const AccountNotActiveError = new APIError(400, 'General', `Can't reset your password. Your account has not been activated yet!`);
            return next(AccountNotActiveError);
        }


        // Create a new code
        user.ActivationCode = randomUUID();
        await UserRepository.update(user.Id, user);
        // Send email with reset link
        await sendResetPasswordEmail(user);

        res.status(200).send({message: 'We have sent instructions to your email address to reset your password.'});
        
    } catch (error) {
        const ServerError : APIError = new APIError(400, 'Server', `Unknown server error`, error);
        return next(ServerError);
    }

}