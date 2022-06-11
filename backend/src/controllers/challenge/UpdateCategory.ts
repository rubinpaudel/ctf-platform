import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { ChallengeCategory } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const UpdateCategory = async (req : Request, res : Response, next : NextFunction) => {

    const { id } = req.params;
    const { CategoryName } = req.body;
    const ChallengeCategoryRepository = CTFDataSource.getRepository(ChallengeCategory);

    try {
        const cat = await ChallengeCategoryRepository.findOne({where: {Name: CategoryName}})
        if(cat){return next(new APIError(500, 'Server', 'Already Taken!'));}
        
        const challengeCategory = await ChallengeCategoryRepository.findOneBy({Id : parseInt(id)});

        if (challengeCategory == null) {
            const NoChallengeFoundError = new APIError(404, 'General', `Challenge with id ${id} doesn't exist!`);
            return next(NoChallengeFoundError);
        }

        challengeCategory.Name = CategoryName;
        
        await ChallengeCategoryRepository.update(challengeCategory.Id, challengeCategory);
        
        res.status(200).send({message : 'Updated challenge Category!', Category: challengeCategory});

    } catch (err) {
        const ServerError = new APIError(500, 'Server', 'Internal Server Error', err.message);
        return next(ServerError);
    }


}