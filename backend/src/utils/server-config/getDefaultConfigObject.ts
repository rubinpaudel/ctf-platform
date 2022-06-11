import { readFileSync } from "fs";
import { DEFAULT_CONFIG_PATH } from "../../consts";
import { CompetitionConfig } from "../../types/CompetitionConfig";

export const GetDefaultConfigObject = () : CompetitionConfig | any  => {
    return new Promise<CompetitionConfig>((resolve, reject) => {

        const file = readFileSync(DEFAULT_CONFIG_PATH, 'utf-8');
        resolve(JSON.parse(file));
    });
};