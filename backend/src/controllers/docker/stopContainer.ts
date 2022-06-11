import { Container } from 'dockerode';
import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { DockerContainer } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';
import { ContainerIsRunning } from '../../utils/docker/ContainerIsRunning';


const Docker = require('dockerode');

const docker = new Docker({socketPath: '/var/run/docker.sock'});


export const StopContainer = async (req : Request, res : Response, next : NextFunction) => {


    const { ContainerName } = req.body;

    try {
        // Initialize Repositories
        const DockerContainerRepository = CTFDataSource.getRepository(DockerContainer);

        // Find Container with the given container name

        const containerCount = await DockerContainerRepository.countBy({Name: ContainerName});
        // If no container is found send an error
        if (containerCount !== 1) {
            const NoContainerFoundException = new APIError(400, 'General', `Container with name : ${ContainerName} doesn't exist.`);
            return next(NoContainerFoundException);
        }


        // Get The Container from the Database with it's ports

        const container = await DockerContainerRepository.findOneBy({Name : ContainerName});
        
        // Check if container is already running
        

        ContainerIsRunning(container)
        .then(containerRunning => {

            if (!containerRunning)
                return res.status(200).send({message : 'Container is not running!'});
            else {
                const dockerContainer : Container = docker.getContainer(container.Name);
                dockerContainer.stop()
                .then(r => res.status(200).send({message : 'Container successfully stopped!'}))
                .catch(err => {
                    const DockerContainerStartError = new APIError(400, 'General', `Couldn't stop container with name : ${container.Name}`, err);
                    return next(DockerContainerStartError);
                })
            }

        })
        .catch((err) => {
            const DockerError = new APIError(400, 'General', 'Unkown docker error', err);
            return next(DockerError);
        })
        
    } catch (err) {
        const ServerError = new APIError(500, 'Server', 'Internal Server Error', err);
        return next(ServerError);
    }


}