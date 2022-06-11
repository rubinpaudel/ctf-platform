import { Image } from "dockerode";
import { CTFDataSource } from "../../orm/dataSource";
import { Challenge, DockerImage } from "../../orm/entities";
import { DeleteContainer } from "./DeleteContainer";



const Docker = require('dockerode');

const docker = new Docker({socketPath: '/var/run/docker.sock'});

export const DeleteImage = async (challenge : Challenge) => {

    const DockerImageRepository = CTFDataSource.getRepository(DockerImage);

    try {
        
        const image = await DockerImageRepository.findOne({where : {Challenge: {Id: challenge.Id}}, relations: ["Container"]});
        
        if (!image) return;

        if (image.Container) {
            console.log('Container Exists');
            try { await DeleteContainer(image.Container); } catch (err) { console.log(err)}
        } 

        const dockerImage : Image = docker.getImage(image.Name);
        
        await dockerImage.remove();
        await DockerImageRepository.remove(image);
        
    } catch (err) {
        throw err;
    }


}