import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from "../../orm/dataSource";
import { Challenge, Round } from "../../orm/entities";
import { APIError } from '../../utils/api-helpers/apiError';


export const filterChallengesOnRound = async (req : Request, res : Response, next : NextFunction) => {


    let roundId: number = parseInt(req.params.roundId);
    const category = req.query.category;
    try {        
        const RoundRepository = CTFDataSource.getRepository(Round);
        const round = await RoundRepository.findOne({where: {Id: roundId}, relations: ["Challenges"]})
        if(!round){
            return new APIError(400, "General", "Round not found.");
        }
        if(category != "") round.Challenges = round.Challenges.filter(challenge => challenge.ChallengeCategory.Name == category)
        res.status(200).send({Challenges : round.Challenges});

    } catch (err) {
        console.log(err);
        const ServerError = new APIError(500, 'Server', 'Internal Server Error', err);
        return next(ServerError);
    }
}