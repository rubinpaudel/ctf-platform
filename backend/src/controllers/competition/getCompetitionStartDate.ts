import { Request, Response, NextFunction } from 'express';
import { CompetitionConfig } from '../../types/CompetitionConfig';
import { APIError } from '../../utils/api-helpers/apiError';
import { GetCompetitionConfigObject } from '../../utils/server-config/getCompetitionConfigObject';

export const GetCompetitionStartDate = async (req : Request, res : Response, next : NextFunction) => {
    const competitionConfig : CompetitionConfig = await GetCompetitionConfigObject();

    if (!competitionConfig) {
        const CompetitonConfigNotFoundError = new APIError(400, 'Server', 'Competition Config not found!');
        return next(CompetitonConfigNotFoundError);
    }

    res.status(200).json({CompetitionStartDate : competitionConfig.CompetitionDate});
}