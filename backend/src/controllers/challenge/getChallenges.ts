import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from "../../orm/dataSource";
import { Challenge, SolvedChallenges, User } from "../../orm/entities";
import { APIError } from '../../utils/api-helpers/apiError';
import { UnlockedChallenge } from '../../utils/challenge/UnlockedChallenge';


export const GetChallenges = async (req : Request, res : Response, next : NextFunction) => {

    // Need to only return name and points

    try {
        const {round, category} = req.params;
        const ChallengeRepository = CTFDataSource.getRepository(Challenge);
        const SolvedChallengesRepository = CTFDataSource.getRepository(SolvedChallenges);
        const UserRepository = CTFDataSource.getRepository(User);

        const {isAdmin, UserID} = req.body.jwtPayload;
        // All challenges are unlocked for admins
        const challenges = await ChallengeRepository.find({where: {Round : {Id : parseInt(round)}, ChallengeCategory: {Id: parseInt(category)} }, select : ["Id", "Name", "Points", "type", "Status"], order:{Id: "asc"}});
        if (isAdmin) {
            const rc : {unlocked : boolean, solved: boolean, challenge: Challenge}[] = [];

            challenges.forEach(challenge => rc.push({unlocked : true, solved: false, challenge: challenge}));

            return res.status(200).send({challenges : rc});
        }
        
        const rc : {unlocked : boolean, solved: boolean, challenge: Challenge}[] = [];

        const user = await UserRepository.findOne({where: {Id: UserID}, relations: ["Team"]});
        for (const challenge of challenges) {
            // Check if the user has the challenge unlocked
            const unlocked = await UnlockedChallenge(UserID, challenge.Id);
            const solve = await SolvedChallengesRepository.findOneBy({Challenge : {Id : challenge.Id}, Team : {Id : user.Team.Id}});
            const solved = solve != null;
            rc.push({unlocked: unlocked, solved: solved, challenge: challenge});
        }


        return res.status(200).send({challenges : rc});

    } catch (err) {
        const ServerError = new APIError(500, 'Server', 'Internal Server Error', err);
        return next(ServerError);
    }
}