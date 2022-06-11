import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { User } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const nameAvailable =  async (req: Request, res: Response, next: NextFunction) => {
    
    const { name } = req.params;
    try {
        let requester: User = await CTFDataSource.getRepository(User).findOne({where: {Name: name}});
        let user : boolean = true;
        if(requester){
            user= false;
        }
        res.status(200).send({available : user});
        
    } catch (err) {
        const ServerError : APIError = new APIError(400, 'Server', `Unknown server error`, null, err);
        return next(ServerError);
    }
}