import { Request, Response, NextFunction } from 'express';

import { CTFDataSource } from '../../orm/dataSource';

import { User, UserCategory } from '../../orm/entities/';

import { APIError } from '../../utils/api-helpers/apiError';



export const RegisterAdmin = async (req : Request, res : Response, next : NextFunction) => {

    const { Name, Password, Category } = req.body;

    const UserRepository = CTFDataSource.getRepository(User);

    try {

        const category : UserCategory = await CTFDataSource.getRepository(UserCategory).findOne({where: {Id: Category}});
        if (!category) {
            const categoryExistsError = new APIError(400, 'General', 'Category doesnt exists', [`Category doesnt exists`]);
            return next(categoryExistsError);
        }

        try {

            const newUser = new User(Name, Name, Password, true, category);
            newUser.Active = true;
            await UserRepository.save(newUser);
            res.status(200).send('Admin successfully created.');

        } catch (err) {
            const ServerError  = new APIError(400, 'Server', `User with email ${Name} can't be created`, null, err);
            return next(ServerError);
        }

    } catch (err) {
        const ServerError : APIError = new APIError(400, 'Server', `Unknown server error`, null, err);
        return next(ServerError);
    }

}