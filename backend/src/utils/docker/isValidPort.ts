import { CTFDataSource } from "../../orm/dataSource";
import { DockerContainerPorts } from "../../orm/entities";
import { PortMapping, PortMappingToString } from "./PortMapping";


/**
 * Checks if the given PortMapping is being used by a container already
 * @param portMapping PortMapping that needs to be checked
 * @returns 
 */
export const isValidPort = (portMapping : PortMapping) : Promise<boolean> => {

    return new Promise<boolean>(async (resolve, reject) => {
        const DockerContainerPortsRepository = CTFDataSource.getRepository(DockerContainerPorts);
        try {
            const count = await DockerContainerPortsRepository.countBy({PortMapping: PortMappingToString(portMapping)});
            if (count >= 1)
                resolve(false);
            resolve(true);
        } catch (err) {
            reject(err);
        }
    })
 }