import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from "../../orm/dataSource";
import { Challenge, ChallengeAttachments, ChallengeCategory } from "../../orm/entities";
import { APIError } from '../../utils/api-helpers/apiError';


export const GetChallengeAttachments = async (req : Request, res : Response, next : NextFunction) => {
    
    try {
        const {id} = req.params;
         
        const ChallengeRepository = CTFDataSource.getRepository(Challenge);
        const ChallengeAttachmentRepository = CTFDataSource.getRepository(ChallengeAttachments);


        let challenge : Challenge = await ChallengeRepository.findOne({where : {Id: parseInt(id)}});
        
        if (challenge == null) {
            const NoChallengeFoundError = new APIError(404, 'General', `Challenge with id : ${id} doesn't exist!`);
            return next(NoChallengeFoundError);
        }

        const attachments = await ChallengeAttachmentRepository.find({where: {Challenge : {Id : challenge.Id}}, select: ["Id", "CreatedAt", "Name"]});
        const ra : {Id : number, FileName: string, CreatedAt : Date  }[] = [];
        for (let i = 0; i < attachments.length; i++) {
            let element : ChallengeAttachments = attachments[i];
            ra.push({Id: element.Id, FileName : element.Name, CreatedAt: element.CreatedAt});
        }

        return res.status(200).send({attachments : ra});

    } catch (err) {
        console.log(err);
        const ServerError = new APIError(500, 'Server', 'Internal Server Error', err);
        return next(ServerError);
    }
}