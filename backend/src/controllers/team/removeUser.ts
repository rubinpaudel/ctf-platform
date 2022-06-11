import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { Team } from '../../orm/entities/team';
import { User } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const removeUser =  async (req: Request, res: Response, next: NextFunction) => {
    
    const TeamRepository = CTFDataSource.getRepository(Team);
    const UserRepository = CTFDataSource.getRepository(User);

    let teamId: number = Number(req.params.teamid);
    let userId : number = Number(req.params.userid);
    let {UserID} = req.body.jwtPayload;
    let requester: User = await CTFDataSource.getRepository(User).findOne({where: {Id: UserID}});
    
    try {
        const team = await TeamRepository.findOne({where: {Id: teamId}, relations: ['Captain', 'Members']});
        if (!team) {
            return next(new APIError(400, 'General', 'Team Not Found'));
        }
        if (!(team.Captain.Id== requester.Id || requester.isAdmin)){
            return next(new APIError(400, 'General', 'Not Authorized'));
        }
        if(!(team.Members.find(member => member.Id == userId))){
            return next(new APIError(400, 'General', 'Given user not in team!'));
        }
        UserRepository.update({Id: userId}, {Team: null});
        res.status(200).send({message : `Successfully Deleted User From Team`});
    } catch (err) {
        const ServerError : APIError = new APIError(400, 'Server', `Unknown server error`, null, err);
        return next(ServerError);
    }
}