import { Request, Response, NextFunction } from 'express';

import { CTFDataSource } from '../../orm/dataSource';
import { PurchasedHint} from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const filterByTeam =  async (req: Request, res: Response, next: NextFunction) => {

    const PurchasedHintRepository = CTFDataSource.getRepository(PurchasedHint);

    let teamId : number = Number(req.params.teamId);

    try {
        let purchasedHintsByTeam: {}[] = [];
        (await PurchasedHintRepository.find({where: {Team: {Id: teamId}}})).map(purchased => {
            purchasedHintsByTeam.push({
                Id: purchased.Id,
                Challenge: {Id: purchased.Challenge.Id},
                Hint: {Id:purchased.Hint.Id}
            });

        });

        return res.status(200).send({data : purchasedHintsByTeam});

    } catch (err) {
        
        const ServerError = new APIError(400, 'Server', 'Server Error', err, null);
        
        return next(ServerError);
    }

}