import { writeFileSync } from "fs";
import { COMPETITION_CONFIG_PATH } from "../../consts";
import { CompetitionConfig } from "../../types/CompetitionConfig";
const fs = require('fs');



export const UpdateCompetitionConfigObject = (config : CompetitionConfig) : boolean => {
    
    writeFileSync(COMPETITION_CONFIG_PATH, JSON.stringify(config), 'utf-8');
    return true;
    
};