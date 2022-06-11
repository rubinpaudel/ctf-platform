import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { ChallengeAttachments, DockerDefaultPorts, Hint } from '../../orm/entities';
import { Challenge, ChallengeType } from '../../orm/entities/challenge';
import { Round } from '../../orm/entities/round';
import { ChallengeCategory } from '../../orm/entities/challengeCategory';
import { APIError } from '../../utils/api-helpers/apiError';
import { CreateImage } from '../../utils/docker/CreateImage';
import { isValidDockerAttachment } from '../../utils/docker/isValidDockerAttachment';

/**
 * Requires body of the following format : {ChallengeType, Challenge, Attachments}
 */
export const CreateChallenge = async (req : Request, res : Response, next : NextFunction) => {

    const ChallengeRepository = CTFDataSource.getRepository(Challenge);
    const ChallengeAttachmentsRepository = CTFDataSource.getRepository(ChallengeAttachments);
    const HintRepository = CTFDataSource.getRepository(Hint);


    try {

        const ChallengeType : ChallengeType = JSON.parse(req.body.data).ChallengeType;
        const {RoundID, ChallengeCategoryID, Name, Description, Points, Flags, Quiz, RequiredChallengesID, Hints} = JSON.parse(req.body.data).Challenge

        // Find the Round The Category and Required Challenges 

        const myRound = await CTFDataSource.getRepository(Round).findOne({where: {Id: RoundID}});
        const myChallengeCategory = await CTFDataSource.getRepository(ChallengeCategory).findOne({where: {Id: ChallengeCategoryID}});

        const myRequiredChallenges = [];
        if(RequiredChallengesID != null)
        {
            for(const reqcha of RequiredChallengesID) {
                let myRequiredChallenge = await CTFDataSource.getRepository(Challenge).findOne({where: {Id: reqcha}});
                myRequiredChallenges.push(myRequiredChallenge);
            };
        }


        try {
            // Attempt at creating a new challenge object using request parameters
            const newChallenge = new Challenge(myRound, Name, Description, myChallengeCategory, Points,  ChallengeType, Flags, Quiz, myRequiredChallenges);
            // Finally save the new Challenge to the repository
            await ChallengeRepository.save(newChallenge);
            

            // Create hints
            
            if (Hints) {
                Hints.forEach((hint : any) => {
                    let newHint;
                    if (hint.PointsType == 'Normal') newHint = new Hint(newChallenge, hint.Order, hint.Hint, hint.PointsValue, null);
                    else newHint = new Hint(newChallenge, hint.Order, hint.Hint, null, hint.PointsValue);
                    HintRepository.save(newHint);
                })    
            }



            // Quiz Challenges Don't have attachments
            if (ChallengeType == 'Quiz') return res.status(200).send({message : 'Quiz Challenge Successfully Created', Challenge: newChallenge});


            
            // If a normal challenge doesn't have any files then challenge creation is done
            if (ChallengeType == 'Normal' && req.files == null) return res.status(200).send({message : 'Normal Challenge Successfully Created', Challenge: newChallenge});

            if (ChallengeType == 'Dockerized' && req.files && req.files.length != 1) return next(new APIError(400, 'General', 'Dockerized Challenge must have 1 attachment'));

            // Now Handle the normal challenges


            if (ChallengeType == 'Normal') {

                for (let i = 0; i < req.files.length; ++i) {
                    const file = req.files[i];
                    const newChallengeAttachment = new ChallengeAttachments(newChallenge, file.path, file.originalname);
                    await ChallengeAttachmentsRepository.save(newChallengeAttachment);
               }

               return res.status(200).send({message : 'Normal Challenge Successfully Created', Challenge: newChallenge});

            } else if (ChallengeType == 'Dockerized') {

                try {

                    // If the Challenge is a Docker file the ports are also specified

                    const {Ports} = JSON.parse(req.body.data).Challenge;


                    // Check if the challenge is a docker challenge by checking the attachment type
                    
                    const attachment : Express.Multer.File = req.files[0];
                    
                    console.log(attachment);


                    if (await isValidDockerAttachment(attachment)) {
                        const newChallengeAttachment = new ChallengeAttachments(newChallenge, attachment.path, attachment.originalname);
                        await ChallengeAttachmentsRepository.save(newChallengeAttachment);
                        
                        const createdImage = await CreateImage(newChallenge);
                        
                        const DockerDefaultPortsRepository = CTFDataSource.getRepository(DockerDefaultPorts);
                        
                        if (Ports) {
                            Ports.forEach(async (port) => {
                                const nDP = new DockerDefaultPorts(createdImage, port);
                                await DockerDefaultPortsRepository.save(nDP);
                            })
                        }
                        
                        
                        return res.status(200).send({message : 'Challenge Successfully Created', Challenge: newChallenge});
                    } else {

                        return next(new APIError(400, 'General', 'Created Challenge without containerization, given attachment was not a valid attachment!'));
                    }                    

                } catch (err) {
                    console.log(err);
                    const ServerError  = new APIError(400, 'Server', `Image Can't be created`, err, null);
                    return next(ServerError);
                }

            }
             
        } catch (err) {
            console.log(err);
            const ServerError  = new APIError(400, 'Server', `Failed to create a challenge`, err, null);
            return next(ServerError);
        }


    } catch (err) {
        const ServerError : APIError = new APIError(400, 'Server', `Unknown server error`, err, null);
        return next(ServerError);
    }

}