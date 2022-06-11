import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { Team } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const getSolvedChallenges = async (req : Request, res : Response, next : NextFunction) => {

    const teamID : number = parseInt(req.params.id);
    const TeamRepository = CTFDataSource.getRepository(Team);
    try {
        const team : Team = await TeamRepository.findOne({where: {Id: teamID}, relations: ['SolvedChallenges', 'SolvedChallenges.User', 'SolvedChallenges.Team', 'SolvedChallenges.Challenge', 'SolvedChallenges.Challenge.ChallengeCategory']});
        if (team == null) {
            const TeamNotFoundError = new APIError(404, 'General', `Team with id : ${teamID} doesn't exist`);
            return next(TeamNotFoundError);
        }
        let solves: {}[]=[];
        for(let solved of team.SolvedChallenges){
            solves.push({
                Id: solved.Id,
                SolvedBy: {User: solved.User.Name, Team: team.Name, TeamId: team.Id},
                Challenge: {Id: solved.Challenge.Id, Name: solved.Challenge.Name, Points : solved.Challenge.Points, Category : solved.Challenge.ChallengeCategory.Name},
                Time: solved.CreatedAt
            });
        }
        return res.status(200).send({solvedChallenges : solves});

    } catch (error) {
        const ServerError : APIError = new APIError(400, 'Server', `Unknown server error`, error);
        return next(ServerError);
    }
}