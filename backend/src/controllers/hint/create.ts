import { Request, Response, NextFunction } from 'express';

import { CTFDataSource } from '../../orm/dataSource';
import { Hint, Challenge } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const create = async (req: Request, res: Response, next: NextFunction) => {

    const HintRepository = CTFDataSource.getRepository(Hint);

    const {ChallengeId, Order, Description, Points, PointsPercentage} = req.body;

    try {
        const myChallenge = await CTFDataSource.getRepository(Challenge).findOne({where: {Id: ChallengeId}, relations: ['Hints']});
        if (!myChallenge) {
            return next(new APIError(400, 'General', 'Challenge Not Found'));
        }
        const newHint = new Hint(myChallenge, Order, Description, Points, PointsPercentage);
        await HintRepository.save(newHint);
        res.status(200).send('Hint successfully created.');
    } catch (err) {
        const ServerError  = new APIError(400, 'Server', `Hint can't be created`, null, err);
        return next(ServerError);
    }

}