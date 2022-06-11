import { Challenge, DockerContainer, DockerImage } from "../../orm/entities";
import { CTFDataSource } from "../../orm/dataSource";


/**
 * Checks if a container exists for a given Challenge
 * @param Challenge 
 */
export const ContainerExists = (challenge : Challenge) => {
    return new Promise <DockerContainer> (async (resolve, reject) => {
        const DockerImageRepository = CTFDataSource.getRepository(DockerImage);


        const image = await DockerImageRepository.findOne({where: { Challenge : { Id: challenge.Id}}, relations: ["Container"]});
        if (image == null) resolve(null);
        
        if (!image.Container) resolve(null);

        resolve(image.Container);

    });


}