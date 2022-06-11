import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from "../../orm/dataSource";
import { ChallengeAttachments} from "../../orm/entities";
import { APIError } from '../../utils/api-helpers/apiError';


export const GetChallengeAttachmentById = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const {id} = req.params;
                
        const ChallengeAttachmentRepository = CTFDataSource.getRepository(ChallengeAttachments);


        let attachment : ChallengeAttachments = await ChallengeAttachmentRepository.findOne({where : {Id: parseInt(id)}});

        if (attachment == null) {
            const NoChallengeAttachmentFoundError = new APIError(404, 'General', `Challenge attachment with id : ${id} doesn't exist!`);
            return next(NoChallengeAttachmentFoundError);
        }
        
        return res.status(200).sendFile(attachment.Path);

    } catch (err) {
        console.log(err);
        const ServerError = new APIError(500, 'Server', 'Internal Server Error', err);
        return next(ServerError);
    }
}