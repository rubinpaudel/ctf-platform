import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { ChallengeCategory, UserCategory } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const DeleteCategory = async (req : Request, res : Response, next : NextFunction) => {

    const { id } = req.params;

    const UserCategoryRepository = CTFDataSource.getRepository(UserCategory);

    try {
        
        const userCategory = await UserCategoryRepository.findOneBy({Id : parseInt(id)});

        if (userCategory == null) {
            const NoCategoryFoundError = new APIError(404, 'General', `User Category with id ${id} doesn't exist!`);
            return next(NoCategoryFoundError);
        }

        await UserCategoryRepository.remove(userCategory);

        res.status(200).send({message : 'Deleted user category!', Category: userCategory});

    } catch (err) {
        const ServerError = new APIError(500, 'Server', 'Internal Server Error', err.message);
        return next(ServerError);
    }

}