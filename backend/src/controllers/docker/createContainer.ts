import { Container } from 'dockerode';
import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { Challenge, DockerContainer, DockerImage } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';
import { ContainerExists } from '../../utils/docker/ContainerExists';
import { CreateImage } from '../../utils/docker/CreateImage';
import { GetDefaultPorts } from '../../utils/docker/GetDefaultPorts';
import { GetValidPorts } from '../../utils/docker/GetValidPorts';
import { ImageExists } from '../../utils/docker/ImageExists';
import { SaveActiveContainerPorts } from '../../utils/docker/SaveActiveContainerPorts';

const Docker = require('dockerode');

const docker = new Docker({socketPath: '/var/run/docker.sock'});


export const CreateContainer = async (req : Request, res : Response, next : NextFunction) => {

  const { ChallengeID } = req.body;

  const ChallengeRepository = CTFDataSource.getRepository(Challenge);
  const DockerImageRepository = CTFDataSource.getRepository(DockerImage);
  const DockerContainerRepository = CTFDataSource.getRepository(DockerContainer);
  try {

    const challenge : Challenge = await ChallengeRepository.findOneBy({Id : ChallengeID});

    const container : DockerContainer = await ContainerExists(challenge);

    if (container) {
      const ServerError = new APIError(500, 'Server', 'Container already exists');
      return next(ServerError);
    }

    // Create Container

    let imageExists = await ImageExists(challenge);
    let image : DockerImage;
    if (!imageExists)
      image = await CreateImage(challenge);
    else 
      image = await DockerImageRepository.findOne({where: {Challenge : {Id: challenge.Id}}, relations: ["Challenge"]});
    // Now Get the Ports

    const defaultPorts : string[] = await GetDefaultPorts(image);
    const usablePorts = await GetValidPorts(defaultPorts);
    const exposedPorts = {};
    Object.keys(usablePorts).forEach((key) => {
      exposedPorts[key] = {};
    });
    
    console.log("Usable Ports: ", usablePorts);
    console.log("Exposed Ports: ", exposedPorts);

    const containerName = `container-${challenge.Name.trim().toLowerCase().replace(/\s+/g, '')}`;

    // Save Each of the ports to the database if container is made successfully
    docker.createContainer({ 
      Image: image.Name, 
      name: containerName, 
      AttachStdout: true,
      AttachStderr: true,
      HostConfig: { PortBindings: usablePorts},
      ExposedPorts: exposedPorts
    })
    .then(async (createdContainer : Container) => {

      // Create Container First
      // Docker Part
      
      const newContainer : DockerContainer = new DockerContainer(containerName);
      await DockerContainerRepository.save(newContainer);
      image.Container = newContainer;
      
      await DockerImageRepository.update(image.DockerImageID, image);

      await SaveActiveContainerPorts(newContainer, usablePorts);
      res.status(200).send({message: "Created Container", Container : newContainer, Image : image});

    })
    .catch((err) => {
      console.log(err);
      const ServerError = new APIError(500, 'Server', 'Docker Server Error', err.errMsg);
      return next(ServerError);
    })

  } catch (err) {
    const ServerError = new APIError(500, 'Server', 'Internal Server Error', err.errMsg);
    return next(ServerError);
  }

}