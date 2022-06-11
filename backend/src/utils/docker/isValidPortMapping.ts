
const PortMappingRegex : string = "([0-9]+)/(tcp|udp|sctp)";
export const isValidPortMapping = (portMapping : string) : boolean => {
    var portMappingRegexTester = new RegExp(PortMappingRegex); 
    return portMappingRegexTester.test(portMapping)

} 