import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { User } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const getTeamIdByUserId =  async (req: Request, res: Response, next: NextFunction) => {

    const UserRepository = CTFDataSource.getRepository(User);

    const id = req.params.id;
    
    try {
        let user: User = await UserRepository.findOne({where: {Id: parseInt(id)}});

        if(!user.Team){
            res.status(200).send(null);
        }
        res.status(200).send({TeamId : user.Team.Id});

    } catch (err) {
        console.log(err)
        const ServerError : APIError = new APIError(400, 'Server', `Unknown server error`, err, null);
        return next(ServerError);
    }
}