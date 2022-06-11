import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { JwtPayload } from '../types/JwtPayload';
import { CreateJwtToken } from '../utils/jwt/createJwtToken';
import { APIError } from '../utils/api-helpers/apiError';


export const CheckJwt = (req : Request, res : Response, next : NextFunction) => {

    const AuthHeader = req.get('Authorization');
    
    if (!AuthHeader) {
        const NoAuthHeaderError = new APIError(400, 'General', 'Authorization header not provided');
        return next(NoAuthHeaderError);
    }

    const JwtToken = AuthHeader.split(' ')[1]; // AuthHeader format : 'Bearer {TOKEN}'

    let JwtPayload : {[key : string] : any};

    try {
        JwtPayload = jwt.verify(JwtToken, process.env.JWT_SECRET as string) as { [key: string]: any };
        ['iat', 'exp'].forEach((keyToRemove) => delete JwtPayload[keyToRemove]);
        
        req.body.jwtPayload = JwtPayload as JwtPayload;

    } catch (err) {
        const JwtError = new APIError(400, 'Server', 'JWT Error', null, err);
        return next(JwtError);
    }

    try {
    
        // Refresh and send a new token on every request
        const NewJwtToken = CreateJwtToken(JwtPayload as JwtPayload);
        res.setHeader('token', `Bearer ${NewJwtToken}`);
        return next();
     
    } catch (err) {
        
        const TokenCreationError = new APIError(400, 'Server', "Token can't be created", null, err);
        return next(TokenCreationError);
      }


}