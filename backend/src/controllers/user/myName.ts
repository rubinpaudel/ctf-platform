import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { User } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const myName =  async (req: Request, res: Response, next: NextFunction) => {
    
    const {UserID} = req.body.jwtPayload;

    try {
        let requester: User = await CTFDataSource.getRepository(User).findOne({where: {Id: UserID}});
        res.status(200).send({myName : requester.Name});
        
    } catch (err) {
        const ServerError : APIError = new APIError(400, 'Server', `Unknown server error`, null, err);
        return next(ServerError);
    }
}