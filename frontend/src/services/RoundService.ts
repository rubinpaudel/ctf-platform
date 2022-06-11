import { apiSettings } from "@/api/apiSettings";
import { getAuthorizationHeader } from "@/helpers/getAuthorizationHeader";
import { Round } from "@/types";

import axios from "axios";

export type _RoundService = {

    getRounds : () => Promise<any>,
    createRound : (r : Round) => Promise<any>,
    editRound : (Name: string, Description: string, StartTime: string, EndTime: string, id : number) => Promise<any>,
    deleteRound: (id: number) => Promise<any>,
    checkName: (name: string) => Promise<any>
    filteredByCategory: (roundId: number, category: string) => Promise<any>
}


export const RoundService : _RoundService = {

    getRounds : () => {
        const apiUrl = `${apiSettings.apiUrl}round/`;
        return axios.get(apiUrl, getAuthorizationHeader());
    },

    filteredByCategory : (roundId: number, category: string) => {
        const apiUrl = `${apiSettings.apiUrl}round/filterCatOnRound/${roundId}?category=${category}`;
        return axios.get(apiUrl ,getAuthorizationHeader());
    },

    createRound : (r : Round) => {
        const apiUrl = `${apiSettings.apiUrl}round/`;
        return axios.post(apiUrl, r, getAuthorizationHeader());
    },

    deleteRound : (id : number) => {
        const apiUrl = `${apiSettings.apiUrl}round/delete/${id}`;
        return axios.post(apiUrl, {}, getAuthorizationHeader());
    },

    editRound : (Name: string, Description: string, StartTime: string, EndTime: string, id: number) => {
        const apiUrl = `${apiSettings.apiUrl}round/${id}`;
        return axios.put(apiUrl, {Name: Name, Description: Description, StartTime: StartTime, EndTime: EndTime}, getAuthorizationHeader());
    },

    checkName: (name: string) => {
        const apiUrl = `${apiSettings.apiUrl}round/nameAvailable/${name}`;
        return axios.get(apiUrl);
    }
};


