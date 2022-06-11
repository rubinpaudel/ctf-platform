import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { User } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const leaveTeam =  async (req: Request, res: Response, next: NextFunction) => {

    const UserRepository = CTFDataSource.getRepository(User);
    const {UserID} = req.body.jwtPayload;

    try {
        let user: User = await CTFDataSource.getRepository(User).findOne({where: {Id: UserID}});
        UserRepository.update(user.Id, {Team: null});
        res.status(200).send({message:'Left Team successfully'});
    } catch (err) {
        const ServerError : APIError = new APIError(400, 'Server', `Unknown server error`, null, err);
        return next(ServerError);
    }
}