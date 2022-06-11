import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { Team } from '../../orm/entities/team';
import { Challenge, Round, User } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';
import { DeleteImage } from '../../utils/docker/DeleteImage';
import { DeleteChallengeAttachments } from '../../utils/challenge/DeleteChallengeAttachments';

export const DeleteRound =  async (req: Request, res: Response, next: NextFunction) => {

    const RoundRepository = CTFDataSource.getRepository(Round);

    let id: number = Number(req.params.id);

    try {
        const round = await RoundRepository.findOne({where: {Id: id}});
        if (!round) {
            return next(new APIError(400, 'General', 'Round doesnt exist!'));
        }

        // Delete All the Attachments and containers from the 
        const challenges = await CTFDataSource.getRepository(Challenge).find({where: {Round : {Id: id}}});

        for (let challenge of challenges) {
            if (challenge.type == 'Dockerized') await DeleteImage(challenge);
            if (challenge.type != 'Quiz') await DeleteChallengeAttachments(challenge);
        }

        await RoundRepository.delete(id);
        res.status(200).send({message : 'Successfully Deleted Round'});
    } catch (err) {
        const ServerError : APIError = new APIError(400, 'Server', `Unknown server error`, null, err);
        return next(ServerError);
    }
}