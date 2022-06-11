import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { UserCategory } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const AddCategory = async (req : Request, res : Response, next : NextFunction) => {

    const { CategoryName } = req.body;

    const UserCategoryRepository = CTFDataSource.getRepository(UserCategory);

    try {
        const category = await UserCategoryRepository.findOne({where: {Name: CategoryName}});
        if(category) { 
            return next(new APIError(400, 'Server', 'Already taken.'));
        }

        // Get all categories
        const categories = await UserCategoryRepository.find({order: {Level: 'ASC'}});

        let newLevel : number = 1;

        if(categories.length != 0){ // GET LEVEL OF LAST CATEGORY BC THEY ARE ORDERED
            newLevel = categories[categories.length - 1].Level + 1;
        }

        const newUserCategory : UserCategory = new UserCategory(CategoryName, newLevel);

        await UserCategoryRepository.save(newUserCategory);

        res.status(200).send({message : 'Created new Challenge Category', Category: newUserCategory});

    } catch (err) {
        const ServerError = new APIError(500, 'Server', 'Internal Server Error', err.message);
        return next(ServerError);
    }

}