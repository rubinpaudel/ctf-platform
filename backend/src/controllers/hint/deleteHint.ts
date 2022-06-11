import { Request, Response, NextFunction } from 'express';

import { CTFDataSource } from '../../orm/dataSource';
import { Hint, Challenge } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const deleteHint = async (req: Request, res: Response, next: NextFunction) => {

    const HintRepository = CTFDataSource.getRepository(Hint);

    let hintId : number = Number(req.params.hintId);

    try {
        await HintRepository.delete(hintId);
        res.status(200).send('Hint successfully deleted.');
    } catch (err) {
        const ServerError  = new APIError(400, 'Server', `Hint can't be deleted`, null, err);
        return next(ServerError);
    }

}