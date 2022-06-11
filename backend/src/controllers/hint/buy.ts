import { Request, Response, NextFunction } from 'express';

import { CTFDataSource } from '../../orm/dataSource';
import { Hint, PurchasedHint, User } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const buy = async (req: Request, res: Response, next: NextFunction) => {

    const HintRepository = CTFDataSource.getRepository(Hint);
    const PurchasedHintRepository = CTFDataSource.getRepository(PurchasedHint);
    const UserRepository = CTFDataSource.getRepository(User);

    const {hintId} = req.body;
    const {UserID} = req.body.jwtPayload;

    try {

        const hint = await HintRepository.findOne({where: {Id: hintId}});
        const user = await UserRepository.findOne({where: {Id: UserID}});

        if (!hint) {
            const HintDoesntExistError = new APIError(400, 'General', 'Hint doesn\'t exist');
            return next(HintDoesntExistError);
        }

        let purchased = (await PurchasedHintRepository.findOne({where: {Hint: {Id: hintId}, Team: {Id: user.Team.Id}}}))
        if(purchased){
            return next(new APIError(400, 'General', 'Hint already bought by teammate! Refresh.', null));
        }

        try {
            const newPurchasedHint = new PurchasedHint(user, hint.Challenge, user.Team, hint);
            await PurchasedHintRepository.save(newPurchasedHint);
            res.status(200).send({Description: hint.Description, TeamId: user.Team.Id});
        } catch (err) {
            const ServerError  = new APIError(400, 'Server', `Purchased Hint can't be created`, null, err);
            return next(ServerError);
        }
    } catch (err) {
        const ServerError  = new APIError(400, 'Server', `Couldn't find hint or user`, null, err);
        return next(ServerError);
    }

}