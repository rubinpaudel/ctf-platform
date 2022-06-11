import { Request, Response, NextFunction } from 'express';

import { CTFDataSource } from '../../orm/dataSource';

import { User } from '../../orm/entities/';

import { APIError } from '../../utils/api-helpers/apiError';


export const ActivateAccount = async (req: Request, res : Response, next : NextFunction) => {

    const { activationCode } = req.params;
    
    const UserRepository = CTFDataSource.getRepository(User);


    try {

        const user = await UserRepository.findOneBy({ActivationCode: activationCode});

        if (user == null) {
            const UserNotFoundError = new APIError(404, 'General', 'The provided activation code is invalid', null, null);
            return next(UserNotFoundError);
        }
        
        user.Active = true;
        user.ActivationCode = null;

        await UserRepository.update(user.Id, user);

        res.status(200).redirect('http://localhost:8080/login');

    } catch (err) {
        const ServerError = new APIError(400, 'Server', 'Unkown server error', err, null);
        return next(ServerError);
    }


}