import { CTFDataSource } from "../../orm/dataSource";
import { Challenge, SolvedChallenges, User } from "../../orm/entities";


export const UnlockedChallenge = async (UserID : number, ChallengeID : number) => {

    const UserRepository = CTFDataSource.getRepository(User);
    const SolvedChallengesRepository = CTFDataSource.getRepository(SolvedChallenges);
    const ChallengeRepository = CTFDataSource.getRepository(Challenge);
    try {
        const challenge = await ChallengeRepository.findOne({where: {Id: ChallengeID}, relations: ["RequiredChallenges"]});
        const user = await UserRepository.findOne({where: {Id : UserID}});
        
        if (user.Team == null) return false;

        // Check if the current round of the challenge is active
        const start : Date = new Date(challenge.Round.StartTime);
        const end : Date = new Date(challenge.Round.EndTime);
        const now : Date = new Date();
        now.setHours(now.getHours()+2);

        if (start.getTime() > now.getTime() || now.getTime() > end.getTime())
            return false;

        // Check if the challenge is locked
        if (challenge.RequiredChallenges.length == 0) return true;
        // Check if all the required challenges have been solved by the team

        for (const rc of challenge.RequiredChallenges) {
            const solve = await SolvedChallengesRepository.findOneBy({Challenge : {Id : rc.Id}, Team : {Id : user.Team.Id}});
            if (solve == null) return false;    
        }   
        return true;

    } catch (error) {
        console.log(error);
        return false;
    }



}