import { Request, Response, NextFunction } from 'express';

import { CTFDataSource } from '../../orm/dataSource';

import { User, UserCategory } from '../../orm/entities/';

import { APIError } from '../../utils/api-helpers/apiError';
import { sendActivationEmail } from '../../utils/mails/sendActivationEmail';


export const Register = async (req : Request, res : Response, next : NextFunction) => {

    const {Email, Password, isAdmin, Name, Category } = req.body;

    const UserRepository = CTFDataSource.getRepository(User);

    try {

        let user : User = await UserRepository.findOne({where: {Email: Email}});

        if (user) {
            const UserExistsError = new APIError(400, 'General', 'User already exists', [`Email '${user.Email}' already exists`]);
            return next(UserExistsError);
        }
        
        user = await UserRepository.findOne({where: {Name: Name}});
        if(user) {
            const UserNameExists = new APIError(400, 'General', 'UserName already exists', [`Name '${user.Name}' already exists`]);
            return next(UserNameExists);
        }

        const category : UserCategory = await CTFDataSource.getRepository(UserCategory).findOne({where: {Id: Category}});
        if (!category && !isAdmin) {
            const categoryExistsError = new APIError(400, 'General', 'Category doesnt exists', [`Category doesnt exists`]);
            return next(categoryExistsError);
        }

        try {

            const newUser = new User(Name, Email, Password, isAdmin, category);
            
            await UserRepository.save(newUser);

            sendActivationEmail(newUser);

            res.status(200).send('User successfully created.');

        } catch (err) {
            const ServerError  = new APIError(400, 'Server', `User with email ${Email} can't be created`, null, err);
            return next(ServerError);
        }

    } catch (err) {
        const ServerError : APIError = new APIError(400, 'Server', `Unknown server error`, null, err);
        return next(ServerError);
    }

}