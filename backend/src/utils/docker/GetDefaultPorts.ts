import { CTFDataSource } from "../../orm/dataSource";
import { DockerDefaultPorts, DockerImage } from "../../orm/entities";

export const GetDefaultPorts = async (dockerImage : DockerImage) => {


    const DockerDefaultPortsRepository = CTFDataSource.getRepository(DockerDefaultPorts);

    try {
        const ports : DockerDefaultPorts[] = await DockerDefaultPortsRepository.find({where: {DockerImage: { DockerImageID : dockerImage.DockerImageID}} });
        
        let portsList : string[] = [];
        ports.forEach((port) => portsList.push(port.PortMapping))

        return portsList;

    } catch (err) {
        console.log(err)
    }




}