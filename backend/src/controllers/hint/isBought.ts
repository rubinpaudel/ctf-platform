import { Request, Response, NextFunction } from 'express';

import { CTFDataSource } from '../../orm/dataSource';
import { PurchasedHint, User} from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const isBought =  async (req: Request, res: Response, next: NextFunction) => {

    const PurchasedHintRepository = CTFDataSource.getRepository(PurchasedHint);

    let hintId : number = Number(req.params.hintId);
    const {UserID} = req.body.jwtPayload;

    try {
        const user = await CTFDataSource.getRepository(User).findOne({where: {Id: UserID}, relations: ['Team']});
        let purchased;
        if(user.Team){
            purchased = await PurchasedHintRepository.findOne({where: {Hint: {Id: hintId}, Team: {Id: user.Team.Id}}});
        }else{
            purchased = await PurchasedHintRepository.findOne({where: {Hint: {Id: hintId}, User: {Id: UserID}}});
        }

        if(purchased){
            return res.status(200).send({isBought : true, Description: purchased.Hint.Description});
        }
        return res.status(200).send({isBought : false});
        
    } catch (err) {

        console.log(err);
        
        const ServerError = new APIError(400, 'Server', 'Server Error', err, null);
        
        return next(ServerError);
    }

}