import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { Team } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const getTeamPointsPerRound = async (req : Request, res : Response, next : NextFunction) => {

    const teamID : number = parseInt(req.params.id);
    const TeamRepository = CTFDataSource.getRepository(Team);
    let rel = [ 
    'PurchasedHints', 'PurchasedHints.Challenge', 'PurchasedHints.Challenge.Round',  
    'SolvedChallenges', 'SolvedChallenges.Challenge', 'SolvedChallenges.Challenge.Round', // For points
    ];

    try {
        const team : Team = await TeamRepository.findOne({where: {Id: teamID}, relations : rel});
        if (team == null) {
            const TeamNotFoundError = new APIError(404, 'General', `Team with id : ${teamID} doesn't exist`);
            return next(TeamNotFoundError);
        }
        return res.status(200).send({TeamPointsPerRoundMap : team.getPointsPerRound()});

    } catch (error) {
        console.log(error);
        const ServerError : APIError = new APIError(400, 'Server', `Unknown server error`, error);
        return next(ServerError);
    }
}