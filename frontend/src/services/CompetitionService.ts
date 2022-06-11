import { apiSettings } from "@/api/apiSettings";
import { getAuthorizationHeader } from "@/helpers/getAuthorizationHeader";

import axios from "axios";

export type _CompetitionService = {
    getAllowedEmailDomains : () => Promise<any>,
    getCompetitionName : () => Promise<any>,
    getCompetitionStartDate : () => Promise<any>,

    wipe : () => Promise<any>,

    updateAllowedEmailDomains : (allowedEmails : string) => Promise<any>
    updateCompetitionName : (newCompetitionName: string) => Promise<any>
    updateCompetitionStartDate : (newStartDate : Date) => Promise<any>
}


export const CompetitionService : _CompetitionService = {

    wipe : () => {

        const apiUrl = `${apiSettings.apiUrl}competition/wipe`;
        return axios.post(apiUrl, {}, getAuthorizationHeader());
    },

    getAllowedEmailDomains : () => {
        const apiUrl = `${apiSettings.apiUrl}competition/allowedEmails`;
        
        return new Promise((resolve, reject) => {
    
            axios.get(apiUrl)
            .then((response) => {
                resolve(response);
            })
            .catch((err) => {
                reject(err);
            })
    
        });
    },

    getCompetitionName : () => {

 
        const apiUrl = `${apiSettings.apiUrl}competition/name`;

        return axios.get(apiUrl)
  

    },

    getCompetitionStartDate : () => {
        const apiUrl = `${apiSettings.apiUrl}competition/startDate`;

        return axios.get(apiUrl)


    },

    updateAllowedEmailDomains : (allowedEmails : string) => {
        const apiUrl = `${apiSettings.apiUrl}competition/allowedEmails`;


        return axios.post(apiUrl, { AllowedEmailDomains : allowedEmails}, getAuthorizationHeader());
       

    },

    updateCompetitionStartDate : (newStartDate: Date) => {
        const apiUrl = `${apiSettings.apiUrl}competition/startDate`;

        return axios.post(apiUrl, {CompetitionDate : newStartDate}, getAuthorizationHeader());
                
    },

    updateCompetitionName : (newCompetitionName : string) => {
        const apiUrl = `${apiSettings.apiUrl}competition/name`;

        return axios.post(apiUrl, { CompetitionName: newCompetitionName }, getAuthorizationHeader());
    }


};


