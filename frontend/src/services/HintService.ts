import { apiSettings } from "@/api/apiSettings";
import { getAuthorizationHeader } from "@/helpers/getAuthorizationHeader";

import axios from "axios";

export type _HintService = {
    filterByChallenge : (ChallengeID : number) => Promise<any>
    buy : (HintID : number) => Promise<any>
    isBought : (HintID : number) => Promise<any>,
    getAdminHints : (ChallengeID : number) => Promise<any>
}


export const HintService : _HintService = {

    getAdminHints : (ChallengeID : number) => {
        const apiUrl = `${apiSettings.apiUrl}hint/${ChallengeID}`;
        return axios.get(apiUrl, getAuthorizationHeader());
    },

    filterByChallenge : (ChallengeID : number) => {
        const apiUrl = `${apiSettings.apiUrl}team/filterByChallenge/${ChallengeID}`;

        return axios.get(apiUrl, getAuthorizationHeader())
                
    },

    buy : (HintID : number) => {
        const apiUrl = `${apiSettings.apiUrl}hint/buy`;

        return axios.post(apiUrl, {hintId : HintID}, getAuthorizationHeader())
    },

    isBought : (HintID : number) => {
        const apiUrl = `${apiSettings.apiUrl}hint/isBought/${HintID}`;

        return axios.get(apiUrl, getAuthorizationHeader())
                
    }


}