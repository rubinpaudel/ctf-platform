import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { ChallengeAttachments} from '../../orm/entities';
import { Challenge } from '../../orm/entities/challenge';
import { APIError } from '../../utils/api-helpers/apiError';

export const AddChallengeAttachment = async (req : Request, res : Response, next : NextFunction) => {

    const ChallengeRepository = CTFDataSource.getRepository(Challenge);
    const ChallengeAttachmentsRepository = CTFDataSource.getRepository(ChallengeAttachments);

    try {
        const id = parseInt(req.params.id);
        
        const myChallenge = await ChallengeRepository.findOneBy({Id: id});
        if (myChallenge == null) {
            const NoChallengeException = new APIError(404, 'General', `Challenge with id : ${id} doesn't exist.`, null, null);
            return next(NoChallengeException);
        }

        let CreatedChallengeAttachments = [];

        for (let i = 0; i < req.files.length; ++i) {
            const file = req.files[i];
            const newChallengeAttachment = new ChallengeAttachments(myChallenge, file.path, file.originalname);
            await ChallengeAttachmentsRepository.save(newChallengeAttachment);
            CreatedChallengeAttachments.push(newChallengeAttachment);
        }

        return res.status(200).send({message : 'Uploaded Attachments', attachments: CreatedChallengeAttachments});

             
        } catch (err) {
            const ServerError  = new APIError(400, 'Server', `Unknown Server Error`, err, null);
            return next(ServerError);
        }

}