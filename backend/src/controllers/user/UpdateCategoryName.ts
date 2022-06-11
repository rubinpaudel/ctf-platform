import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { UserCategory } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const UpdateCategoryName = async (req : Request, res : Response, next : NextFunction) => {

    const { id } = req.params;
    const { CategoryName } = req.body;
    const UserCategoryRepository = CTFDataSource.getRepository(UserCategory);

    try {
        const category = await UserCategoryRepository.findOne({where: {Name: CategoryName}});
        if(category) { 
            return next(new APIError(400, 'Server', 'Already taken.'));
        }
        
        const userCategory = await UserCategoryRepository.findOneBy({Id : parseInt(id)});

        if (userCategory == null) {
            const NoCategoryFoundError = new APIError(404, 'General', `User category with id ${id} doesn't exist!`);
            return next(NoCategoryFoundError);
        }

        userCategory.Name = CategoryName;
        await UserCategoryRepository.update(userCategory.Id, userCategory);

        res.status(200).send({message : 'Updated user category!', Category: userCategory});

    } catch (err) {
        const ServerError = new APIError(500, 'Server', 'Internal Server Error', err.message);
        return next(ServerError);
    }


}