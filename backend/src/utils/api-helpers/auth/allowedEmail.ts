import { CompetitionConfig } from '../../../types/CompetitionConfig';
import { GetCompetitionConfigObject } from '../../../utils/server-config/getCompetitionConfigObject';

export const allowedEmail = async () => {

    const competitionConfig : CompetitionConfig = await GetCompetitionConfigObject();
    return competitionConfig.AllowedEmailDomains;
    
}