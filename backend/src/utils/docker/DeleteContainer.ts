import { Container } from "dockerode";
import { CTFDataSource } from "../../orm/dataSource";
import { DockerContainer } from "../../orm/entities";


const Docker = require('dockerode');

const docker = new Docker({socketPath: '/var/run/docker.sock'});

export const DeleteContainer = async (container : DockerContainer) => {


    try {
        const dockerContainer : Container = docker.getContainer(container.Name);
        try { await dockerContainer.stop(); } catch (err) {}
        try { await dockerContainer.remove() } catch (err) {}
        await CTFDataSource.getRepository(DockerContainer).remove(container);
    } catch (error) {
        throw error
    }


}