import { Socket } from "socket.io";
import jwt from 'jsonwebtoken';
import { JwtPayload } from "../../types/JwtPayload";


export const CheckAdminSocketConnection = (socket : Socket, next : any) => {
    
    if (socket.handshake.query && socket.handshake.query.token) {

        let JwtToken : string = socket.handshake.query.token as string; 
        let JwtPayload : JwtPayload;
        try {
            JwtPayload = jwt.verify(JwtToken, process.env.JWT_SECRET as string) as JwtPayload;
            // Check if the user is an admin
            if (!JwtPayload.isAdmin) next(new Error("Authorization Error : Insufficient funds!"));
            // If verify succeeds the user is authenticated
            next();
        } catch (err) { next(new Error("Authentication error : Couldn't verify JWT Token!")); }

    } else next(new Error('Authentication error : Token not provided!'));
    
}