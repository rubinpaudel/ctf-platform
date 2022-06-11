import { Request, Response, NextFunction } from 'express';

import { CTFDataSource } from '../../orm/dataSource';

import { DockerContainer } from '../../orm/entities';

import { APIError } from '../../utils/api-helpers/apiError';
import { ContainerIsRunning } from '../../utils/docker/ContainerIsRunning';

export const IsRunning = async (req : Request, res : Response, next : NextFunction) => {

    const {ContainerName} = req.body;
    
    const DockerContainerRepository = CTFDataSource.getRepository(DockerContainer);

    try {
        const container = await DockerContainerRepository.findOne({where: {Name: ContainerName}});
        const containerInfo = await ContainerIsRunning(container);
        res.status(200).send({IsRunning : containerInfo.State.Running, Ports : containerInfo.NetworkSettings.Ports});
    } catch (err) {
        const ServerError  = new APIError(404, 'Server', `Unknown Server Error`, null, err);
        return next(ServerError);
    }

}