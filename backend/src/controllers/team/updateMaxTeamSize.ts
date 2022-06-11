import { Request, Response, NextFunction } from 'express';
import { APIError } from '../../utils/api-helpers/apiError';
import { GetCompetitionConfigObject } from '../../utils/server-config/getCompetitionConfigObject';
import { UpdateCompetitionConfigObject } from '../../utils/server-config/updateCompetitionConfigObject';


export const UpdateMaxTeamSize = async (req : Request, res : Response, next : NextFunction) => {
    
    const {TeamSize} = req.body;

    const competitionConfig = await GetCompetitionConfigObject();

    if (!competitionConfig) {
        const CompetitonConfigNotFoundError = new APIError(400, 'Server', 'Competition Config not found!');
        return next(CompetitonConfigNotFoundError);
    }
    
    competitionConfig.TeamSize = TeamSize;

    const updated = UpdateCompetitionConfigObject(competitionConfig);

    if (!updated) {
        const FailedToUpdateCompetitionName = new APIError(400, 'Server', 'Failed to update competition name');
        return next(FailedToUpdateCompetitionName);
    }

    return res.status(200).send(`Max team size successfully updated to ${TeamSize}`);

}