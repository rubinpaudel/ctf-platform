import { CreateValidDockerPortBinding, PortBinding } from './CreateValidDockerPortBinding';
import { GenerateRandomPort } from './GenerateRandomPort';
import {isValidPort} from './isValidPort'
import { GetPortMappingObjectByString } from './PortMapping';

/**
 *  Checks if the default ports are valid, if a port is not valid then it generates a valid port
 * @param defaultPorts 
 */
export const GetValidPorts = (defaultPorts : string[]) : Promise<object> => {

    return new Promise<object>(async (resolve, reject) => {

        let validPorts : object = {};
        console.log(defaultPorts);

        for (const defaultPort of defaultPorts) {
            const portMapping = GetPortMappingObjectByString(defaultPort);
            const valid = await isValidPort(portMapping);
            if (valid) {
                const portBinding : PortBinding = CreateValidDockerPortBinding(portMapping, portMapping.PortNumber.toString()); // {}
                validPorts[Object.keys(portBinding)[0]] = portBinding[Object.keys(portBinding)[0]];
            } else {
                // Generate Port
                try {
                    const randomPortNumber = await GenerateRandomPort();
                    const portMappingString = `${portMapping.PortNumber}/${portMapping.PortProtocol}`;
                    const portBinding : PortBinding = CreateValidDockerPortBinding(GetPortMappingObjectByString(portMappingString), randomPortNumber.toString());
                    validPorts[Object.keys(portBinding)[0]] = portBinding[Object.keys(portBinding)[0]];
                } catch(err) { reject(err) }
            }
        }    
        resolve(validPorts);
    })

}