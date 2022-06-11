import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { Round } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';
import { GetCompetitionConfigObject } from '../../utils/server-config/getCompetitionConfigObject';
import { UpdateCompetitionConfigObject } from '../../utils/server-config/updateCompetitionConfigObject';



export const UpdateCompetitionStartDate = async (req : Request, res : Response, next : NextFunction) => {
    const {CompetitionDate} = req.body;

    const competitionConfig = await GetCompetitionConfigObject();

    if (!competitionConfig) {
        const CompetitonConfigNotFoundError = new APIError(400, 'Server', 'Competition Config not found!');
        return next(CompetitonConfigNotFoundError);
    }
    
    competitionConfig.CompetitionDate = CompetitionDate;

    const updated = UpdateCompetitionConfigObject(competitionConfig);

    if (!updated) {
        const FailedToUpdateCompetitionName = new APIError(400, 'Server', 'Failed to update competition name');
        return next(FailedToUpdateCompetitionName);
    }

    const RoundRepository = CTFDataSource.getRepository(Round);
    
    const rounds = await RoundRepository.find();

    for (let round of rounds) {
        
        // Create New Date
        const newStartTime = new Date(CompetitionDate);
        const newEndTime = new Date(CompetitionDate);

        newStartTime.setHours(round.StartTime.getHours());
        newStartTime.setMinutes(round.StartTime.getMinutes());
        newEndTime.setHours(round.EndTime.getHours());
        newEndTime.setMinutes(round.EndTime.getMinutes());

        round.StartTime = newStartTime;
        round.EndTime = newEndTime;

        await RoundRepository.update(round.Id, round);
    }


    return res.status(200).send(`Competition name successfully updated to ${CompetitionDate}`);

}