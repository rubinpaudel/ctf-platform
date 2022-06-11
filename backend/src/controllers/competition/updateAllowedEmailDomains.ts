import { Request, Response, NextFunction } from 'express';
import { APIError } from '../../utils/api-helpers/apiError';
import { GetCompetitionConfigObject } from '../../utils/server-config/getCompetitionConfigObject';
import { UpdateCompetitionConfigObject } from '../../utils/server-config/updateCompetitionConfigObject';

export const UpdateAllowedEmailDomains = async (req : Request, res : Response, next : NextFunction) => {
    const {AllowedEmailDomains} = req.body;

    const competitionConfig = await GetCompetitionConfigObject();

    if (!competitionConfig) {
        const CompetitonConfigNotFoundError = new APIError(400, 'Server', 'Competition Config not found!');
        return next(CompetitonConfigNotFoundError);
    }
    try {
        competitionConfig.AllowedEmailDomains = AllowedEmailDomains.split(',');
 
        const updated = UpdateCompetitionConfigObject(competitionConfig);
    
        if (!updated) {
            const FailedToUpdateCompetitionName = new APIError(400, 'Server', 'Failed to update competition name');
            return next(FailedToUpdateCompetitionName);
        }
    
        return res.status(200).send(`Allowed Domains successfully updated to ${AllowedEmailDomains}`);
    
    } catch (error) {
        const CompetitonConfigNotFoundError = new APIError(400, 'Server', 'Failed to update allowed email domains!');
        return next(CompetitonConfigNotFoundError);
    }

}