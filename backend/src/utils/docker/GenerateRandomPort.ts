import { Like } from "typeorm";
import { CTFDataSource } from "../../orm/dataSource";
import { DockerContainerPorts } from "../../orm/entities";
import { PortMapping } from "./PortMapping";


const PORT_LOWER_BOUND = 14000;
const PORT_UPPER_BOUND = 15000; 


const GenerateRandomNumber = () : number => {

    return Math.random() * (PORT_UPPER_BOUND - PORT_LOWER_BOUND) + PORT_LOWER_BOUND;
} 


export const GenerateRandomPort = () : Promise<number> => {

    return new Promise<number>(async (resolve, reject) => {

        const DockerContainerPortsRepository = CTFDataSource.getRepository(DockerContainerPorts);

        const validPortFound : boolean = false;

        for (let i = PORT_LOWER_BOUND; i < PORT_UPPER_BOUND || validPortFound; i++) {


            const randomPort = GenerateRandomNumber();

            // Check if the port is already being used

            const count = await DockerContainerPortsRepository.countBy({PortMapping : Like(`${randomPort}/%`)})

            if (count == 0)
                resolve(Math.floor(randomPort));
        }

        reject("No valid ports left, modify your lower or upper port bounds");


    });

    
}