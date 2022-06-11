import jwt from 'jsonwebtoken';


import { JwtPayload } from '../../types/JwtPayload';


export const CreateJwtToken = (Payload : JwtPayload) : string => {

    return jwt.sign(Payload, process.env.JWT_SECRET!, {expiresIn : process.env.JWT_EXPIRATION});
}
