import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { Team } from '../../orm/entities/team';
import { User } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const create =  async (req: Request, res: Response, next: NextFunction) => {

    const TeamRepository = CTFDataSource.getRepository(Team);
    const UserRepository = CTFDataSource.getRepository(User);

    const {Name, Password} = req.body;
    const {UserID} = req.body.jwtPayload;

    try {
        console.log(Name);
        const team = await TeamRepository.findOne({where: {Name}});

        if (team) {
            const TeamExistsError = new APIError(400, 'General', 'Team already exists', [`Name '${team.Name}' already exists`]);
            return next(TeamExistsError);
        }

        try {
            let Captain: User = await CTFDataSource.getRepository(User).findOne({where: {Id: UserID}});
            const newTeam = new Team(Name, Password, Captain);
            await TeamRepository.save(newTeam);
            await UserRepository.update(Captain.Id, {Team: newTeam});
            res.status(200).send({message : 'Team successfully created.'});
        } catch (err) {
            const ServerError  = new APIError(400, 'Server', `Team with name ${Name} can't be created`, null, err);
            return next(ServerError);
        }
    } catch (err) {
        const ServerError : APIError = new APIError(400, 'Server', `Unknown server error`, null, err);
        return next(ServerError);
    }
}