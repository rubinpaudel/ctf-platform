import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from "../../orm/dataSource";
import { Challenge } from "../../orm/entities";
import { APIError } from '../../utils/api-helpers/apiError';


export const GetFlags = async (req : Request, res : Response, next : NextFunction) => {

    // Need to only return name and points

    try {
        const {id} = req.params;

        const ChallengeRepository = CTFDataSource.getRepository(Challenge);
        
        const challenge = await ChallengeRepository.findOneBy({Id: parseInt(id)});
        

        return res.status(200).send({Flags : challenge.Flags});

    } catch (err) {
        const ServerError = new APIError(500, 'Server', 'Internal Server Error', err);
        return next(ServerError);
    }
}