import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { Team } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const getPurchasedHints = async (req : Request, res : Response, next : NextFunction) => {
    
    const teamID : number = parseInt(req.params.id);
    const TeamRepository = CTFDataSource.getRepository(Team);
    try {
        const team : Team = await TeamRepository.findOne({where: {Id: teamID}, relations: ['PurchasedHints', 'PurchasedHints.Team']});
        if (team == null) {
            const TeamNotFoundError = new APIError(404, 'General', `Team with id : ${teamID} doesn't exist`);
            return next(TeamNotFoundError);
        }
        let purchased: {}[] = [];
        for(let purchase of team.PurchasedHints){
            purchased.push({
                Id: purchase.Id,
                PurchasedBy: {User: purchase.User.Name, Team: purchase.Team.Name, TeamId: purchase.Team.Id},
                Challenge: {Id: purchase.Challenge.Id, Name: purchase.Challenge.Name},
                Hint: {Id: purchase.Hint.Id, Description: purchase.Hint.Description},
                Time: purchase.CreatedAt
            });
        }
        return res.status(200).send({purchasedHints : purchased});

    } catch (error) {
        const ServerError : APIError = new APIError(400, 'Server', `Unknown server error`, error);
        return next(ServerError);
    }
}