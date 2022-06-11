import { Request, Response, NextFunction } from 'express';

import { CTFDataSource } from "../../orm/dataSource";
import { Attempt, Challenge, SolvedChallenges, Team, User} from "../../orm/entities";
import { APIError } from '../../utils/api-helpers/apiError';


export const CompleteQuiz = async (req : Request, res : Response, next : NextFunction) => {

    try {
        const {id} = req.params;
        const {UserID} = req.body.jwtPayload;

        let submitter: User = await CTFDataSource.getRepository(User).findOne({where: {Id: UserID}, relations: ["Team"]});

        if (submitter.Team == null) {
            return next(new APIError(400, 'General', 'You need to have a team to submit an attempt!'));
        }


        const ChallengeRepository = CTFDataSource.getRepository(Challenge);

        const challenge = await ChallengeRepository.findOne({where: {Id: parseInt(id)}});
        if(!challenge){
            return next(new APIError(400, 'General', 'Challenge not found!'));
        }

        const newAttempt: Attempt = new Attempt(challenge, submitter, submitter.Team, challenge.Flags[0]);
        await CTFDataSource.getRepository(Attempt).save(newAttempt);
 
        const solved: SolvedChallenges = new SolvedChallenges(submitter.Team, submitter, challenge);
        await CTFDataSource.getRepository(SolvedChallenges).save(solved);
        res.status(200).send({message : 'Completed Quiz!'});

    } catch (err) {
        const ServerError = new APIError(500, 'Server', 'Internal Server Error', err);
        return next(ServerError);
    }
}