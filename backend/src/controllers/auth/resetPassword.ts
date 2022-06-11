import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { User } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const ResetPassword = async (req: Request, res : Response, next : NextFunction) => {

    const {ResetCode, Password} = req.body;

    const UserRepository = CTFDataSource.getRepository(User);

    try {
        console.log(ResetCode);
        
        const user = await UserRepository.findOneBy({ActivationCode: ResetCode});

        if (user == null) {
            const UserNotFoundError = new APIError(404, 'General', `The given password reset does not exist!`);
            return next(UserNotFoundError);
        }
        
        user.Password = Password;
        user.hashPassword();

        await UserRepository.update(user.Id, user);

        res.status(200).send({message : 'Successfully reset your password!'});

    } catch (error) {
        const ServerError : APIError = new APIError(400, 'Server', `Unknown server error`, error);
        return next(ServerError);
    }

}