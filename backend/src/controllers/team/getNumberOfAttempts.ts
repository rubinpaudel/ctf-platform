import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { Team } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const getNumberOfAttempts = async (req : Request, res : Response, next : NextFunction) => {

    const teamID : number = parseInt(req.params.id);
    const TeamRepository = CTFDataSource.getRepository(Team);
    try {
        const team : Team = await TeamRepository.findOne({where: {Id: teamID}, relations: ['Attempts', 'Attempts.Team']});
        if (team == null) {
            const TeamNotFoundError = new APIError(404, 'General', `Team with id : ${teamID} doesn't exist`);
            return next(TeamNotFoundError);
        }
        let numAttempts = 0;
        for(let attempt of team.Attempts){
            numAttempts += 1;
        }
        return res.status(200).send({NumberOfAttempts : numAttempts});

    } catch (error) {
        const ServerError : APIError = new APIError(400, 'Server', `Unknown server error`, error);
        return next(ServerError);
    }
}