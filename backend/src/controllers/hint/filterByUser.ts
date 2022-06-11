import { Request, Response, NextFunction } from 'express';

import { CTFDataSource } from '../../orm/dataSource';
import { PurchasedHint} from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const filterByUser =  async (req: Request, res: Response, next: NextFunction) => {

    const PurchasedHintRepository = CTFDataSource.getRepository(PurchasedHint);

    let userId : number = Number(req.params.userId);

    try {

        let purchasedHintsByUser: {}[] = [];
        (await PurchasedHintRepository.find({where: {User: {Id: userId}}})).map(purchased => {
            purchasedHintsByUser.push({
                Id: purchased.Id,
                Challenge: {Id: purchased.Challenge.Id},
                Hint: {Id:purchased.Hint.Id}
            });

        });

        return res.status(200).send({data : purchasedHintsByUser});

    } catch (err) {
        
        const ServerError = new APIError(400, 'Server', 'Server Error', err, null);
        
        return next(ServerError);
    }

}