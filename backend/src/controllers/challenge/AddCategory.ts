import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { ChallengeCategory } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const AddCategory = async (req : Request, res : Response, next : NextFunction) => {

    const { CategoryName } = req.body;

    const ChallengeCategoryRepository = CTFDataSource.getRepository(ChallengeCategory);

    try {
        const cat = await ChallengeCategoryRepository.findOne({where: {Name: CategoryName}})
        if(cat){return next(new APIError(500, 'Server', 'Already Taken!'));}
        
        const newChallengeCategory : ChallengeCategory = new ChallengeCategory(CategoryName);

        await ChallengeCategoryRepository.save(newChallengeCategory);

        res.status(200).send({message : 'Created new Challenge Category', Category: newChallengeCategory});

    } catch (err) {
        const ServerError = new APIError(500, 'Server', 'Internal Server Error', err.message);
        return next(ServerError);
    }

}