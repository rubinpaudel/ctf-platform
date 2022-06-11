import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from "../../orm/dataSource";
import { Round } from "../../orm/entities";
import { APIError } from '../../utils/api-helpers/apiError';


export const ListRounds = async (req : Request, res : Response, next : NextFunction) => {

    // Need to only return name and points

    try {         
        const RoundRepository = CTFDataSource.getRepository(Round);
        let rounds : Round[] = [];

        if (req.body?.jwtPayload?.isAdmin) rounds = await RoundRepository.find({relations: ["Challenges"], order: {Challenges:{Id:"asc"}}});
        else rounds = await RoundRepository.find({select: ["Id", "Name", "Description", "StartTime", "EndTime"], order: {Challenges: {Id: "asc"}}});
        res.status(200).send({Rounds : rounds});

    } catch (err) {
        console.log(err);
        const ServerError = new APIError(500, 'Server', 'Internal Server Error', err);
        return next(ServerError);
    }
}