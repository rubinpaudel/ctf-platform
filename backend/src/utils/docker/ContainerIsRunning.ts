import { Container, ContainerInspectInfo } from "dockerode";
import { DockerContainer } from "../../orm/entities";
const Docker = require('dockerode');

const docker = new Docker({socketPath: '/var/run/docker.sock'});

export const ContainerIsRunning = async (container : DockerContainer) : Promise<ContainerInspectInfo> => {


    return new Promise<ContainerInspectInfo>((resolve, reject) => {

        const ContainerName = container.Name;
        try {
            const dockerContainer : Container = docker.getContainer(ContainerName);
    
            dockerContainer.inspect()
            .then((containerInfo : ContainerInspectInfo) => {
                resolve(containerInfo);
            })
            .catch(err => {
                reject(err);
            })
        
        } catch (err) { reject(err)}
        
    });



} 