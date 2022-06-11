import { readFileSync } from "fs";
import { COMPETITION_CONFIG_PATH } from "../../consts";
import { CompetitionConfig } from "../../types/CompetitionConfig";

export const GetCompetitionConfigObject = () : CompetitionConfig | any  => {
    return new Promise<CompetitionConfig>((resolve, reject) => {
        const file = readFileSync(COMPETITION_CONFIG_PATH, 'utf-8');
        resolve(JSON.parse(file));
    });
};