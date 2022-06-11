import { isValidPortMapping } from "./isValidPortMapping";

export type PortMapping = {
    PortNumber : number,
    PortProtocol : string,
};


export const GetPortNumberFromPortMapping = (portMapping : string) : number => {
    if (!isValidPortMapping(portMapping))
        throw new Error('The given port mapping is not valid');

    const portNumber : number = parseInt(portMapping.split('/')[0]);

    return portNumber;
}


export const GetPortProtocolFromPortMapping =  (portMapping : string) : string => {
    if (!isValidPortMapping(portMapping))
        throw new Error('The given port mapping is not valid');

    const portProtocol : string = portMapping.split('/')[1];

    return portProtocol;
}


export const GetPortMappingObjectByString = (portMapping : string) : PortMapping => {

    const PortNumber = GetPortNumberFromPortMapping(portMapping);
    const PortProtocol = GetPortProtocolFromPortMapping(portMapping);
    
    return {PortNumber, PortProtocol};
}


export const PortMappingToString = (portMapping : PortMapping) : string => {
    return `${portMapping.PortNumber}/${portMapping.PortProtocol}`
}