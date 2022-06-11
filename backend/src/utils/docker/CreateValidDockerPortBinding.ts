import { PortMapping, PortMappingToString } from "./PortMapping";


export type PortBinding = {
    [PortBinding : string] : [
        {
            HostPort : string,
            HostIp?: string,
        }
    ]
}




export const CreateValidDockerPortBinding = (portMapping : PortMapping, hostPort : string) : PortBinding => {

    let portBinding : PortBinding = {};

    const hostPortObject = { HostPort : hostPort, HostIp: ""};

    portBinding[PortMappingToString(portMapping)] = [hostPortObject];

    return portBinding;
}