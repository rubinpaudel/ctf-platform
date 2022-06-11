import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from "../../orm/dataSource";
import { ChallengeAttachments} from "../../orm/entities";
import { APIError } from '../../utils/api-helpers/apiError';


export const GetAttachmentName = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const {id} = req.params;
                
        const ChallengeAttachmentRepository = CTFDataSource.getRepository(ChallengeAttachments);

        let attachment : ChallengeAttachments = await ChallengeAttachmentRepository.findOne({where : {Id: parseInt(id)}});
        return res.status(200).send({Name: attachment.Name});

    } catch (err) {
        console.log(err);
        const ServerError = new APIError(500, 'Server', 'Internal Server Error', err);
        return next(ServerError);
    }
}