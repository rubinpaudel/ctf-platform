import { CompetitionConfig } from '../../../types/CompetitionConfig';
import { GetCompetitionConfigObject } from '../../../utils/server-config/getCompetitionConfigObject';

export const isAllowedEmail = async (Email : string) => {

    const competitionConfig : CompetitionConfig = await GetCompetitionConfigObject();
    return competitionConfig.AllowedEmailDomains.includes(Email.split("@")[1]);
    
}