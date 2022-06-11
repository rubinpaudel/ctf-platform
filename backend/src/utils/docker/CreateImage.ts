import { resolveMx } from "dns";
import { UPLOADS_PATH } from "../../consts";
import { CTFDataSource } from "../../orm/dataSource";
import { Challenge, DockerContainer, DockerImage } from "../../orm/entities";
import { GetChallengeAttachmentPath } from "../challenge/GetChallengeAttachmentPath";
import { ImageExists } from "./ImageExists";

const Docker = require('dockerode');

const docker = new Docker({socketPath: '/var/run/docker.sock'});

export const CreateImage = (challenge : Challenge) : Promise<DockerImage> => {

    // Check if the Image Exists
    return new Promise<DockerImage>(async (resolve, reject) => {
        
        
        try {
            const imageExists = await ImageExists(challenge);

            if (imageExists) resolve(null);

            const path = await GetChallengeAttachmentPath(challenge);

            const imageName = challenge.Name.trim().toLowerCase().replace(/\s+/g, '');

            let stream = await docker.buildImage(path, {t: imageName});

            new Promise((resolve, reject) => {
                docker.modem.followProgress(stream, (err, response) => err ? reject(err) : resolve(response));
            })
            .then( async (response) => {
                const image : DockerImage = new DockerImage(imageName, challenge);

                await CTFDataSource.getRepository(DockerImage).save(image);
                resolve(image)
            })
            .catch((err) => {
                reject(err)
            })

        } catch (err) {
            reject(err);
        }

        
    });




}


