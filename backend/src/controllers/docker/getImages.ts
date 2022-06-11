import { Request, Response, NextFunction } from 'express';

import { CTFDataSource } from '../../orm/dataSource';

import { DockerImage } from '../../orm/entities';

import { APIError } from '../../utils/api-helpers/apiError';

export const GetImages = async (req : Request, res : Response, next : NextFunction) => {

    const DockerImageRepository = CTFDataSource.getRepository(DockerImage);

    try {
        const images = await DockerImageRepository.find({relations: ["Container", "Challenge"]});
        const imagesList = [];
        images.forEach((image : DockerImage) => {
            try {
                imagesList.push({ 
                    DockerImageID : image.DockerImageID, 
                    Name: image.Name, CreatedAt : 
                    image.CreatedAt, 
                    Container : image.Container,
                    Challenge : { Id : image.Challenge.Id}})
            } catch (err) {  }

        })

        res.status(200).send({Images : imagesList});
    } catch (err) {
        const ServerError  = new APIError(404, 'Server', `Unknown Server Error`, err, null);
        return next(ServerError);
    }

}