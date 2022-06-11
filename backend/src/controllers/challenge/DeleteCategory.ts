import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { ChallengeCategory } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const DeleteCategory = async (req : Request, res : Response, next : NextFunction) => {

    const { id } = req.params;

    const ChallengeCategoryRepository = CTFDataSource.getRepository(ChallengeCategory);

    try {
        
        const challengeCategory = await ChallengeCategoryRepository.findOneBy({Id : parseInt(id)});

        if (challengeCategory == null) {
            const NoChallengeFoundError = new APIError(404, 'General', `Challenge with id ${id} doesn't exist!`);
            return next(NoChallengeFoundError);
        }

        await ChallengeCategoryRepository.remove(challengeCategory);

        res.status(200).send({message : 'Deleted challenge Category!', Category: challengeCategory});

    } catch (err) {
        const ServerError = new APIError(500, 'Server', 'Internal Server Error', err.message);
        return next(ServerError);
    }

}