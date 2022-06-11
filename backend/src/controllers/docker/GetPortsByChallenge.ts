
import { Request, Response, NextFunction } from 'express';

import { CTFDataSource } from '../../orm/dataSource';

import { Challenge, DockerContainerPorts, DockerDefaultPorts, DockerImage } from '../../orm/entities';

import { APIError } from '../../utils/api-helpers/apiError';

export const GetPortsByChallenge = async (req : Request, res : Response, next : NextFunction) => {

    const DockerImageRepository = CTFDataSource.getRepository(DockerImage);
    const DockerContainerPortsRepository = CTFDataSource.getRepository(DockerContainerPorts);
    const DockerDefaultPortsRepository = CTFDataSource.getRepository(DockerDefaultPorts);
    
    try {
        const id = parseInt(req.params.id);
        
        // Get The Container
        const challenge = await CTFDataSource.getRepository(Challenge).findOne({where: {Id: id}});

        if (challenge == null) { return next(new APIError(404, 'General', 'Challenge not found with id: ' + id)); }

        const image = await DockerImageRepository.findOne({where : {Challenge : {Id: id}}, relations: ["Container"]});

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