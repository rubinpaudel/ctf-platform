import { Request, Response, NextFunction } from 'express';

import { CTFDataSource } from '../../orm/dataSource';
import { Hint, Challenge } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const GetAdminHints = async (req: Request, res: Response, next: NextFunction) => {

    const challenge = parseInt(req.params.challenge);

    try {
        const myChallenge = await CTFDataSource.getRepository(Challenge).findOne({where: {Id: challenge}, relations: ['Hints']});
        if (!myChallenge) {
            return next(new APIError(400, 'General', 'Challenge Not Found'));
        }

        res.status(200).send({Hints : myChallenge.Hints});
    } catch (err) {
        const ServerError  = new APIError(400, 'Server', `Unkown Server Error`, null, err);
        return next(ServerError);
    }

}