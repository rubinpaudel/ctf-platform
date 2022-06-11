import { CTFDataSource } from "../../orm/dataSource";
import { DockerContainerPorts, DockerContainer } from "../../orm/entities";

export const GetContainerPorts = async (dockerContainer : DockerContainer) => {


    const DockerContainerPortsRepository = CTFDataSource.getRepository(DockerContainerPorts);

    try {
        const ports = await DockerContainerPortsRepository.findBy({DockerContainer: <any>dockerContainer, });
        
        let portsList : string[];

        ports.forEach((port) => portsList.push(port.PortMapping))

        return portsList;

    } catch (err) {

    }

}