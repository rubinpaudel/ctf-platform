import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { User, UserCategory } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const GetUserCategories =  async (req: Request, res: Response, next: NextFunction) => {

    try {

        const UserCategoryRepository = CTFDataSource.getRepository(UserCategory);

        const categories = await UserCategoryRepository.find({order: {Level: 'ASC'}});
        res.status(200).send({UserCategories : categories});
        
    } catch (err) {
        const ServerError : APIError = new APIError(400, 'Server', `Unknown server error`, null, err);
        return next(ServerError);
    }
}