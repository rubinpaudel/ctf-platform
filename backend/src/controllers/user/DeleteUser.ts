import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { User } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const DeleteUser =  async (req: Request, res: Response, next: NextFunction) => {

    const UserRepository = CTFDataSource.getRepository(User);

    let id: number = Number(req.params.id);
    try {
        const user = await UserRepository.findOne({where: {Id: id}});
        if (!user) {
            return next(new APIError(400, 'General', 'User not found.'));
        }
        UserRepository.delete(id);
        res.status(200).send({message : 'Successfully Deleted User'});
    } catch (err) {
        const ServerError : APIError = new APIError(400, 'Server', `Unknown server error`, null, err);
        return next(ServerError);
    }
}