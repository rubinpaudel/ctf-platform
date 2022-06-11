import { CTFDataSource } from "../../orm/dataSource";
import { DockerContainer, DockerContainerPorts } from "../../orm/entities";
import { GetPortMappingObjectByString } from "./PortMapping";


export const SaveActiveContainerPorts = async (container : DockerContainer, ports : object) => {
    const DockerContainerPortsRepository = CTFDataSource.getRepository(DockerContainerPorts);
    
    try {
        let dockerContainerPorts : DockerContainerPorts[] = [];
        for (let [key, value] of Object.entries(ports)) {
            const portMapping = GetPortMappingObjectByString(key);
            const newString = `${value[0].HostPort}/${portMapping.PortProtocol}`;
            console.log(newString);
            let newDockerContainerPort : DockerContainerPorts = new DockerContainerPorts(container, newString);
            dockerContainerPorts.push(newDockerContainerPort);
        }
        await DockerContainerPortsRepository.save(dockerContainerPorts);
    } catch (err) {
        throw err;
    }
}