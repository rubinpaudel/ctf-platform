import { Socket } from "socket.io";
import jwt from 'jsonwebtoken';

export const CheckUserSocketConnection = (socket : Socket, next : any) => {
    if (socket.handshake.query && socket.handshake.query.token) {

        let JwtToken : string = socket.handshake.query.token as string; 

        try {
            jwt.verify(JwtToken, process.env.JWT_SECRET as string) as { [key: string]: any };
            // If verify succeeds the user is authenticated
            next();
        } catch (err) {
            // Failed to verify jwt token
            next(new Error("Authentication error : Couldn't verify JWT Token!"));
        }

    } else {
        next(new Error('Authentication error : Token not provided!'));
    }
}