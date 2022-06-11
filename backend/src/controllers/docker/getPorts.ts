
import { Request, Response, NextFunction } from 'express';

import { CTFDataSource } from '../../orm/dataSource';

import { DockerContainerPorts, DockerDefaultPorts, DockerImage } from '../../orm/entities';

import { APIError } from '../../utils/api-helpers/apiError';

export const GetPorts = async (req : Request, res : Response, next : NextFunction) => {

    const DockerImageRepository = CTFDataSource.getRepository(DockerImage);
    const DockerContainerPortsRepository = CTFDataSource.getRepository(DockerContainerPorts);
    const DockerDefaultPortsRepository = CTFDataSource.getRepository(DockerDefaultPorts);
    
    try {
        const id = parseInt(req.params.id);
        
        // Get The Container
        const image = await DockerImageRepository.findOne({where : {DockerImageID : id}, relations: ["Container"]});

        const defaultPorts = await DockerDefaultPortsRepository.find({where: {DockerImage : {DockerImageID: image.DockerImageID}}});
        if (image.Container) {
            const containerPorts = await DockerContainerPortsRepository.find({where: {DockerContainer: {DockerContainerID: image.Container.DockerContainerID}}});
            return res.status(200).send({DefaultPorts : defaultPorts, ContainerPorts : containerPorts});
        }
        else res.status(200).send({DefaultPorts : defaultPorts, ContainerPorts : null});
    } catch (err) {
        console.log(err)
        const ServerError  = new APIError(404, 'Server', `Unknown Server Error`, err, null);
        return next(ServerError);
    }

}