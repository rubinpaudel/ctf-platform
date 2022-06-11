import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { PurchasedHint } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const removePurchasedHint = async (req : Request, res : Response, next : NextFunction) => {

    let purchasedId : number = Number(req.params.purchasedId);

    try {
        await CTFDataSource.getRepository(PurchasedHint).delete({Id:purchasedId});
        return res.status(200).send("Removed Purchased");

    } catch (error) {
        const ServerError : APIError = new APIError(400, 'Server', `Unknown server error`, error);
        return next(ServerError);
    }
}