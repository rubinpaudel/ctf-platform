import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { Team } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const getTeam = async (req : Request, res : Response, next : NextFunction) => {


    const teamID : number = parseInt(req.params.id);
    const TeamRepository = CTFDataSource.getRepository(Team);
    let rel = [ 'Members', 'Captain',
                'PurchasedHints', 'SolvedChallenges', 'SolvedChallenges.Challenge','SolvedChallenges.User', // For points
                'Attempts.Challenge', 'Attempts.User' ]; // For Attempts
    try {
        
        const team = await TeamRepository.findOne({where: {Id: teamID}, relations: rel});
        if (team == null) {
            const TeamNotFoundError = new APIError(404, 'General', `Team with id : ${teamID} doesn't exist`);
            return next(TeamNotFoundError);
        }
        let Members: {}[] = [];
        team.Members.map(member => {
            Members.push({
                Id: member.Id, 
                Name: member.Name, 
                Category: member.UserCategory.Name,
                Points: team.getPointsOfUserForTeam(member.Id),
                Attempts: team.Attempts.filter(attempt => attempt.User.Id == member.Id).map(memberAttempt => (
                            {
                                Id: memberAttempt.Id,
                                Challenge: memberAttempt.Challenge.Id,
                                Flag: memberAttempt.Flag,
                                Time: memberAttempt.CreatedAt
                            }))
            });
        });
        return res.status(200).send({Team : {Id: team.Id,Name: team.Name, Captain: {Name: team.Captain.Name, Id: team.Captain.Id}, Points: team.getPoints(), Members: Members, Category: team.getHighestCategory().Name}});

    } catch (error) {
        const ServerError : APIError = new APIError(400, 'Server', `Unknown server error`, error);
        return next(ServerError);
    }
}