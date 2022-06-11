import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from "../../orm/dataSource";
import { Challenge, ChallengeCategory } from "../../orm/entities";
import { APIError } from '../../utils/api-helpers/apiError';


export const GetChallengeById = async (req : Request, res : Response, next : NextFunction) => {

    // Need to only return name and points

    try {
        const {id} = req.params;
        
        const ChallengeRepository = CTFDataSource.getRepository(Challenge);

        let challenge : Challenge = await ChallengeRepository.findOne({where : {Id: parseInt(id)}, relations: ["RequiredChallenges"],select: ["ChallengeCategory", "Description", "Name", "Id", "Points", "Quiz", "Round", "type", "RequiredChallenges"]});

        if (challenge == null) {
            const NoChallengeFoundError = new APIError(404, 'General', `Challenge with id : ${id} doesn't exist!`);
            return next(NoChallengeFoundError);
        }

        res.status(200).send({challenge});

    } catch (err) {
        console.log(err);
        const ServerError = new APIError(500, 'Server', 'Internal Server Error', err);
        return next(ServerError);
    }
}