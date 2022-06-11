import { Request, Response, NextFunction } from 'express';

import { CTFDataSource } from "../../orm/dataSource";
import { Attempt, Challenge, SolvedChallenges, Team, User} from "../../orm/entities";
import { APIError } from '../../utils/api-helpers/apiError';


export const SubmitFlag = async (req : Request, res : Response, next : NextFunction) => {

    try {
        const {id} = req.params;
        const {UserID} = req.body.jwtPayload;
        const {Flag} = req.body;

        let submitter: User = await CTFDataSource.getRepository(User).findOne({where: {Id: UserID}, relations: ["Team"]});
        

        if (submitter.Team == null) {
            return next(new APIError(400, 'General', 'You need to have a team to submit an attempt!'));
        }

        const ChallengeRepository = CTFDataSource.getRepository(Challenge);

        const challenge = await ChallengeRepository.findOne({where: {Id: parseInt(id)}});
        if(!challenge){
            return next(new APIError(400, 'General', 'Challenge not found!'));
        }
        

        
        const solve = (await CTFDataSource.getRepository(SolvedChallenges).findOne({where: {Team: {Id: submitter.Team?.Id}, Challenge: {Id: parseInt(id)}}}))
        if(solve){
            return next(new APIError(400, 'General', 'Challenge solved by teammate! Refresh.', null));
        }
        
        const AttemptRepository = CTFDataSource.getRepository(Attempt);

        const UserAttempts= await AttemptRepository.find({where : {User: {Id: submitter.Id}, Challenge: {Id: challenge.Id}}, order: {CreatedAt : 'DESC'}});
        if (UserAttempts.length > 0) {
            const currentDate = new Date();
            const secondsPassedFromLastAttempt = (currentDate.getTime() - UserAttempts[0].CreatedAt.getTime()) / 1000;
            if (secondsPassedFromLastAttempt < 60) return next(new APIError(400, 'General', `You can submit a flag every minute, ${Math.round(60 - secondsPassedFromLastAttempt)}s remaining before next attempt.`));
        }

        // Check if a team member has already submitted 
        
        const attempt = await AttemptRepository.findOneBy({Challenge: {Id: challenge.Id}, Team: {Id: submitter.Team?.Id}, Flag: Flag});
        if (attempt) return next(new APIError(400, 'General', 'This attempt has been already made by your team!', null));
        // Create new Attempt
        const newAttempt: Attempt = new Attempt(challenge, submitter, submitter.Team, Flag);
        await AttemptRepository.save(newAttempt);
        if(challenge.Flags.includes(Flag)){
            const solved: SolvedChallenges = new SolvedChallenges(submitter.Team, submitter, challenge);
            await CTFDataSource.getRepository(SolvedChallenges).save(solved);
            res.status(200).send("Correct flag!");
        }else{
            return next(new APIError(400, "General", "Wrong Flag!"));
        }
        

    } catch (err) {
        console.log(err)
        const ServerError = new APIError(500, 'Server', 'Internal Server Error', err);
        return next(ServerError);
    }
}