import { Request, Response, NextFunction } from 'express';
import { rmSync } from 'fs';
import { CTFDataSource } from "../../orm/dataSource";
import { ChallengeAttachments} from "../../orm/entities";
import { APIError } from '../../utils/api-helpers/apiError';


export const DeleteAttachment = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const {id} = req.params;
                
        const ChallengeAttachmentRepository = CTFDataSource.getRepository(ChallengeAttachments);


        let attachment : ChallengeAttachments = await ChallengeAttachmentRepository.findOne({where : {Id: parseInt(id)}});

        if (attachment == null) {
            const NoChallengeAttachmentFoundError = new APIError(404, 'General', `Challenge attachment with id : ${id} doesn't exist!`);
            return next(NoChallengeAttachmentFoundError);
        }
        
        // Remove the files

        rmSync(attachment.Path, { recursive: true, force : true});

        // Remove from database

        await ChallengeAttachmentRepository.delete(attachment.Id);

        return res.status(200).send({message : `Deleted attachment with id : ${attachment.Id}`});

    } catch (err) {
        console.log(err);
        const ServerError = new APIError(500, 'Server', 'Internal Server Error', err);
        return next(ServerError);
    }
}