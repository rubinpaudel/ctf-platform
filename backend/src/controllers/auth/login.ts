import { Request, Response, NextFunction } from 'express';

import { CTFDataSource } from '../../orm/dataSource';

import { User } from '../../orm/entities/';
import { JwtPayload } from '../../types/JwtPayload';

import { APIError } from '../../utils/api-helpers/apiError';
import { CreateJwtToken } from '../../utils/jwt/createJwtToken';


export const Login = async (req: Request, res : Response, next : NextFunction) => {

    const {Email, Password} = req.body;

    const UserRepository = CTFDataSource.getRepository(User);
    

    try {
        // Find user with the provided email address
        const User = await UserRepository.findOne({where: {Email}});

        // If User doesn't exist return error response
        if (!User) {

            const UserNotFoundError = new APIError(404, 'General', 'Email or Password is incorrect', ['Incorrect email or password']);
            return next(UserNotFoundError); 
        }

        // Check if user password is valid

        if (!User.checkPasswordMatch(Password)) { 
            const IncorrectPaswordError = new APIError(404, 'General', 'Email or Password is incorrect', ['Incorrect email or password']);
            return next(IncorrectPaswordError);
        }
        
        // Check if the user has activated their account

        if (!User.Active) { // 
           const InactiveAccountError = new APIError(403, 'Unauthorized', 'Account must be activated to sign in!');
           return next(InactiveAccountError);
        }


        const NewJwtPayload : JwtPayload = {
            UserID : User.Id,
            Name : User.Name,
            Email : User.Email,
            isAdmin : User.isAdmin,
            CreatedAt : User.CreatedAt
        }

        // Create a new JWT Token
        try {
            const Token = CreateJwtToken(NewJwtPayload);
            res.status(200).send({message : 'Successfully Created Jwt Token.', token : Token} );
        } catch (err) {
            const JwtTokenError = new APIError(400, 'Server', "Token can't be created", null, err);
            return next(JwtTokenError);
        }



    } catch (err) {
        const ServerError = new APIError(400, 'Server', 'Unknown server error', null, err);
        return next(ServerError);
    }


}