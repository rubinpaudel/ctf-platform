import { Request, Response, NextFunction } from 'express';

import { CTFDataSource } from "../../orm/dataSource";
import { ChallengeCategory } from "../../orm/entities";
import { APIError } from '../../utils/api-helpers/apiError';


export const GetChallengeCategory = async (req : Request, res : Response, next : NextFunction) => {

    try {
        const {round, category} = req.params;
         
        const ChallengeCategoryRepository = CTFDataSource.getRepository(ChallengeCategory);

        const ChallengeCategories = await ChallengeCategoryRepository.find({order: {Id: 'asc'}});

        res.status(200).send({ChallengeCategories : ChallengeCategories});

    } catch (err) {
        const ServerError = new APIError(500, 'Server', 'Internal Server Error', err);
        return next(ServerError);
    }
}