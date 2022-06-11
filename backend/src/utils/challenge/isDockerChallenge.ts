
import { CTFDataSource } from "../../orm/dataSource"
import { Challenge, ChallengeAttachments } from "../../orm/entities"
import { isValidDockerAttachment } from "../docker/isValidDockerAttachment";


/**
 * Checks if a given challenge is a docker challenge
 * @param challenge Challenge that needs to be checked if it's a docker Challenge
 * @returns 
 */
export const isDockerChallenge = (challenge : Challenge) : Promise<boolean> => {

    return new Promise<boolean>(async (resolve, reject) => {

        try {            
            // Check if the count of attachments is 1
            const DockerAttachmentRepository = CTFDataSource.getRepository(ChallengeAttachments);
    
            DockerAttachmentRepository.find({where: {Challenge : {Id: challenge.Id}}})
            .then((attachments) => {
                console.log(attachments.length);
                if (attachments.length != 1) resolve(false);
                const attachment : ChallengeAttachments = attachments[0];
            
                const fileType = attachment.Path.split(".")[1];
                console.log(fileType)
                if (fileType.trim().toLowerCase() != "zip") { 
                    
                    console.log("Not a zip");
                    resolve(false);
                }; 
                
                // Check if there is a docker file
                resolve(isValidDockerAttachment(attachment.Path));
            })
            .catch(err => console.log(err))
    
        } catch (err) {
            reject(err);
        }
    })

}