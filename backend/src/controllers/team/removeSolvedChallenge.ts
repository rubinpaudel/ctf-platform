import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { Attempt, SolvedChallenges, Team, User } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const removeSolvedChallenge = async (req : Request, res : Response, next : NextFunction) => {
    
    const solvedId : number = parseInt(req.params.solvedId);
    try {
        const solved = await CTFDataSource.getRepository(SolvedChallenges).findOne({where: {Id: solvedId}, relations: ["Team", "Challenge"]});
        await CTFDataSource.getRepository(SolvedChallenges).delete(solvedId);
        const attempts = await CTFDataSource.getRepository(Attempt).find({where: {Challenge:{Id: solved.Challenge.Id}, Team: {Id: solved.Team.Id}}})
        await CTFDataSource.getRepository(Attempt).remove(attempts);
        return res.status(200).send("Removed Solved");

    } catch (error) {
        const ServerError : APIError = new APIError(400, 'Server', `Unknown server error`, error);
        return next(ServerError);
    }
}