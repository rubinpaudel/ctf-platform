import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { Team } from '../../orm/entities/team';
import { User } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const addPointsToTeam =  async (req: Request, res: Response, next: NextFunction) => {

    const TeamRepository = CTFDataSource.getRepository(Team);

    const id = req.params.id;
    const {Points} = req.body;

    let rel = [ 'Members', 'Captain',
                'PurchasedHints', 'SolvedChallenges', 'SolvedChallenges.Challenge','SolvedChallenges.User']; // For Attempts

    try {
        const team = await TeamRepository.findOne({where: {Id: parseInt(id)}, relations: rel});

        if (!team) {
            const TeamExistsError = new APIError(400, 'General', 'Team does not exist');
            return next(TeamExistsError);
        }

        try {
            let pointsToAdd: number = Points - team.getPoints() + team.Points;
            team.Points = pointsToAdd;
            await TeamRepository.save(team);
            res.status(200).send({message : 'Points succesfully changed'});
        } catch (err) {
            const ServerError  = new APIError(400, 'Server', `Team with name ${team.Name} can't be changed on points`, null, err);
            return next(ServerError);
        }
    } catch (err) {
        const ServerError : APIError = new APIError(400, 'Server', `Unknown server error`, null, err);
        return next(ServerError);
    }
}