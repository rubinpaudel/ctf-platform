import path from "path";

export const SALT_ROUNDS = 10;
export const ROOT_PATH = path.resolve(__dirname + '/../../');
export const COMPETITION_CONFIG_PATH = path.resolve(ROOT_PATH + '/src/CompetitionConfig.json');
export const DEFAULT_CONFIG_PATH = path.resolve(ROOT_PATH + '/src/DefaultCompetitionConfig.json');
export const UPLOADS_PATH = path.resolve(ROOT_PATH + '/uploads/')