import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { Challenge} from '../../orm/entities/challenge';
import { Round } from '../../orm/entities/round';
import { ChallengeCategory } from '../../orm/entities/challengeCategory';
import { APIError } from '../../utils/api-helpers/apiError';


/**
 * Requires body of the following format : {ChallengeType, Challenge, Attachments}
 */
export const EditChallenge = async (req : Request, res : Response, next : NextFunction) => {

    const ChallengeRepository = CTFDataSource.getRepository(Challenge);

    try {
        const {RoundID, ChallengeCategoryID, Name, Description, Points, Flags, Quiz, RequiredChallengeID} = req.body.Challenge
        const id = parseInt(req.params.id);
        // Find the Round The Category and Required Challenges 
        // Find Challenge 
        const myChallenge = await ChallengeRepository.findOneBy({Id: id});
                
        if (myChallenge == null) {
            const NoChallengeException = new APIError(404, 'General', `Challenge with id : ${id} doesn't exist.`, null, null);
            return next(NoChallengeException);
        }

        const myRound = await CTFDataSource.getRepository(Round).findOne({where: {Id: RoundID}});
        const myChallengeCategory = await CTFDataSource.getRepository(ChallengeCategory).findOne({where: {Id: ChallengeCategoryID}});

        const myRequiredChallenges : Challenge[] = [];
        if(RequiredChallengeID != null)
        {
            for(const reqcha of RequiredChallengeID) {
                let myRequiredChallenge = await CTFDataSource.getRepository(Challenge).findOne({where: {Id: reqcha}});
                myRequiredChallenges.push(myRequiredChallenge);
            };
        }
        
        console.log(myRequiredChallenges);
        myChallenge.ChallengeCategory = myChallengeCategory;
        myChallenge.Round = myRound;
        myChallenge.Name = Name;
        myChallenge.Points = Points;
        myChallenge.Description = Description;
        myChallenge.RequiredChallenges = myRequiredChallenges;
        myChallenge.Quiz = Quiz;
        myChallenge.Flags = Flags;
        console.log(myChallenge);
       
        // Finally save the new Challenge to the repository
        await ChallengeRepository.save(myChallenge);

        res.status(200).send({message: 'Challenge successfully updated!', Challenge: myChallenge});
             
    } catch (err) {
        console.log(err);
        const ServerError  = new APIError(400, 'Server', `Failed to update challenge.`, err, null);
        return next(ServerError);
    }
}