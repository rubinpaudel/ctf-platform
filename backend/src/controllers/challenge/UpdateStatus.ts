import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { Challenge, ChallengeCategory } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const UpdateStatus = async (req : Request, res : Response, next : NextFunction) => {

    const { id } = req.params;
    const { Status } = req.body;
    const ChallengeRepo = CTFDataSource.getRepository(Challenge);

    try {
        const challenge = await ChallengeRepo.findOne({where: {Id: parseInt(id)}})
        if(!challenge){return next(new APIError(400, 'Server', 'Challenge not found!'));}

        challenge.Status = Status;
        await ChallengeRepo.save(challenge);
        res.status(200).send({message : 'Updated challenge status!'});

    } catch (err) {
        const ServerError = new APIError(500, 'Server', 'Internal Server Error', err.message);
        return next(ServerError);
    }


}