import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { UserCategory } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const UpdateCategoryLevel = async (req : Request, res : Response, next : NextFunction) => {

    const { id } = req.params;
    const { CategoryLevel } = req.body;
    const UserCategoryRepository = CTFDataSource.getRepository(UserCategory);

    try {
        
        const userCategory = await UserCategoryRepository.findOneBy({Id : parseInt(id)});

        if (userCategory == null) {
            const NoCategoryFoundError = new APIError(404, 'General', `User category with id ${id} doesn't exist!`);
            return next(NoCategoryFoundError);
        }

        userCategory.Level = CategoryLevel;
        await UserCategoryRepository.update(userCategory.Id, userCategory);

        res.status(200).send({message : 'Updated Level of category!'});

    } catch (err) {
        const ServerError = new APIError(500, 'Server', 'Internal Server Error', err.message);
        return next(ServerError);
    }


}