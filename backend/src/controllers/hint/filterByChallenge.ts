import { Request, Response, NextFunction } from 'express';

import { CTFDataSource } from '../../orm/dataSource';
import { Hint } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const filterByChallenge =  async (req: Request, res: Response, next: NextFunction) => {

    const HintRepository = CTFDataSource.getRepository(Hint);

    let challengeId : number = Number(req.params.challengeId);

    try {

        let hintsFromChallenge: {}[] = [];
        let text: string = "";
        (await HintRepository.find({where: {Challenge: {Id: challengeId}}})).map(hint => {
            text ="";
            if((hint.Points == 0 || hint.Points == null) && hint.PointsPercentage != 0){text = hint.PointsPercentage+"%";}
            if(hint.Points != 0 && (hint.PointsPercentage == 0 || hint.PointsPercentage == null)){text = hint.Points+"p";}
            hintsFromChallenge.push({
                Hint: {
                    Id: hint.Id,
                    ChallengeId: hint.Challenge.Id,
                    Order: hint.Order,
                    Text: text,
                    Points: hint.Points,
                    PointsPercentage: hint.PointsPercentage
                }
            });

        });

        return res.status(200).send({hints : hintsFromChallenge});

    } catch (err) {
        
        const ServerError = new APIError(400, 'Server', 'Server Error', err, null);
        
        return next(ServerError);
    }

}