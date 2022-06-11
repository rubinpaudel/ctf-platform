import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { Team } from '../../orm/entities/team';
import { User } from '../../orm/entities';
import { CompetitionConfig } from '../../types/CompetitionConfig';
import { GetCompetitionConfigObject } from '../../utils/server-config/getCompetitionConfigObject';
import { APIError } from '../../utils/api-helpers/apiError';

export const join =  async (req: Request, res: Response, next: NextFunction) => {

    const TeamRepository = CTFDataSource.getRepository(Team);
    const UserRepository = CTFDataSource.getRepository(User);

    const id = req.params.id;
    const {Password} = req.body;
    const {UserID} = req.body.jwtPayload;


    try {
        let user: User = await UserRepository.findOne({where: {Id: UserID}});

        if(user.Team){
            const AlreadyInTeam = new APIError(400, 'General', 'Already in Team.');
            return next(AlreadyInTeam);
        }

        const team = await TeamRepository.findOne({where: {Id: parseInt(id)}, relations: ['Members']});

        if (!team) {

            const UserNotFoundError = new APIError(404, 'General', 'Not found', ['Wrong teamname.']);
            return next(UserNotFoundError); 
        }
        if (!team.checkPasswordMatch(Password)) { 
            const IncorrectPaswordError = new APIError(404, 'General', 'Not found', ['Incorrect password']);
            return next(IncorrectPaswordError);
        }
        
        const competitionConfig : CompetitionConfig = await GetCompetitionConfigObject();

        if (team.Members.length >= competitionConfig.TeamSize){ 
            const TeamFull = new APIError(404, 'General', 'Team is full!');
            return next(TeamFull);
        }
        
        user.Team = team;
        UserRepository.save(user);
        res.status(200).send({message :'Team successfully joined.'});

    } catch (err) {
        console.log(err)
        const ServerError : APIError = new APIError(400, 'Server', `Unknown server error`, err, null);
        return next(ServerError);
    }
}