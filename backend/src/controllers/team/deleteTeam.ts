import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { Team } from '../../orm/entities/team';
import { User } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const deleteTeam =  async (req: Request, res: Response, next: NextFunction) => {

    const TeamRepository = CTFDataSource.getRepository(Team);

    let id: number = Number(req.params.id);
    let {UserID} = req.body.jwtPayload;
    let requester: User = await CTFDataSource.getRepository(User).findOne({where: {Id: UserID}});
    try {
        const team = await TeamRepository.findOne({where: {Id: id}, relations: ['Captain']});
        if (!team) {
            return next(new APIError(400, 'General', 'Team Not Found'));
        }
        if (!(team.Captain.Id== requester.Id || requester.isAdmin)){
            return next(new APIError(400, 'General', 'Not Authorized'));
        }
        TeamRepository.delete(id);
        res.status(200).send({message : 'Successfully Deleted Team'});
    } catch (err) {
        const ServerError : APIError = new APIError(400, 'Server', `Unknown server error`, null, err);
        return next(ServerError);
    }
}