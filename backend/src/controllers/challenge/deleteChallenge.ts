import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { Challenge } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';
import { DeleteChallengeAttachments } from '../../utils/challenge/DeleteChallengeAttachments';
import { DeleteImage } from '../../utils/docker/DeleteImage';

export const DeleteChallenge = async (req : Request, res : Response, next : NextFunction) => {

    const id = parseInt(req.params.id);
    
    const ChallengeRepository = CTFDataSource.getRepository(Challenge);


    try {
        
        const challenge = await ChallengeRepository.findOneBy({Id : id});

        if (challenge == null) {
            const NoChallengeFoundError = new APIError(404, 'General', `Challenge with id ${id} doesn't exist!`);
            return next(NoChallengeFoundError);
        }
        
        // Remove the challenge attachments
        if (challenge.type == 'Dockerized') await DeleteImage(challenge);
        
        if (challenge.type != 'Quiz') await DeleteChallengeAttachments(challenge);

        await ChallengeRepository.remove(challenge);

        res.status(200).send({message : 'Deleted Challenge!', Challenge: challenge});

    } catch (err) {
        console.log(err);
        const ServerError = new APIError(500, 'Server', 'Internal Server Error', err.message);
        return next(ServerError);
    }

} 