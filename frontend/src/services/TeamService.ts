import { apiSettings } from "@/api/apiSettings";
import { getAuthorizationHeader } from "@/helpers/getAuthorizationHeader";
import { NewTeam, Search, UserCategory } from "@/types";

import axios from "axios";

export type _TeamService = {
    getAllTeams : () => Promise<any>,
    getAllTeamsBySearch : (searchP: Search) => Promise<any>,
    getAllTeamsByName : () => Promise<any>,
    getMaxTeamMembers : () => Promise<any>,
    getTeamMembers : (teamId : number) => Promise<any>,
    updateMaxTeamSize : (newSize : number) => Promise<any>,
    updatePoints : (teamId:number, newPoints : number) => Promise<any>,
    getUserTeam : (userId : number) => Promise<any>,
    joinTeam : (teamId : number, password : string) => Promise<any>,
    createTeam : (team : NewTeam) => Promise<any>,
    getSolvedChallenges : (teamId : number) => Promise<any>,
    getNumberOfAttempts : (teamId : number) => Promise<any>,
    getTeamPointsPerRound : (teamId : number) => Promise<any>,
    removeSolvedChallenge : (solvedId : number) => Promise<any>,
    getPurchasedHints: (teamId: number) => Promise<any>,
    removePurchasedHint : (purchasedId : number) => Promise<any>,
    kickMember : (teamId : number, userId : number) => Promise<any>,
    deleteTeam: (teamId: number) => Promise<any>
}


export const TeamService : _TeamService = {

    getAllTeams : () => {
        const apiUrl = `${apiSettings.apiUrl}team/listTeams?filterName=&filterCategory&sortDirection=desc&sortBy=points`;
        return axios.get(apiUrl)
        
    },
    getAllTeamsBySearch : (searchP: Search) => {
        const apiUrl = `${apiSettings.apiUrl}team/listTeams?filterName=${searchP.FilterName}&sortDirection=${searchP.SortDirection}&sortBy=${searchP.SortBy}&filterCategory=${searchP.FilterCategory}`;
        return axios.get(apiUrl)
        
    },

    getAllTeamsByName : () => {
        const apiUrl = `${apiSettings.apiUrl}team/listTeams?filterName=&filterCategory&sortDirection=desc&sortBy`;
        return axios.get(apiUrl)
        
    },

    getMaxTeamMembers : () => {
        const apiUrl = `${apiSettings.apiUrl}team/size`;
        return axios.get(apiUrl)
    },

    getTeamMembers : (teamId : number) => {
         
        const apiUrl = `${apiSettings.apiUrl}team/getTeam/${teamId}`;
        return axios.get(apiUrl);
    },

    updateMaxTeamSize : (newSize : number) => {
        const apiUrl = `${apiSettings.apiUrl}team/size`;
        return axios.post(apiUrl, {TeamSize : newSize}, getAuthorizationHeader())
    },

    updatePoints: (teamId:number, newPoints: number) => {
        const apiUrl = `${apiSettings.apiUrl}team/addPoints/${teamId}`;
        return axios.post(apiUrl, {Points : newPoints}, getAuthorizationHeader())
    },

    getUserTeam : (userId : number) => {
        const apiUrl = `${apiSettings.apiUrl}team/getTeamIdByUserId/${userId}`;
        return axios.get(apiUrl, getAuthorizationHeader())
    },

    joinTeam : (teamId : number, password : string) => {
        const apiUrl = `${apiSettings.apiUrl}team/join/${teamId}`;
        return axios.post(apiUrl, {Password : password}, getAuthorizationHeader())
    },

    createTeam : (newTeam : NewTeam) => {
        const apiUrl = `${apiSettings.apiUrl}team/create`;
        return axios.post(apiUrl, newTeam, getAuthorizationHeader())
    },

    getSolvedChallenges : (teamId : number) => {
        const apiUrl = `${apiSettings.apiUrl}team/getSolvedChallenges/${teamId}`;
        return axios.get(apiUrl);
    },

    getNumberOfAttempts : (teamId : number) => {
        const apiUrl = `${apiSettings.apiUrl}team/getNumberOfAttempts/${teamId}`;
        return axios.get(apiUrl);
    },

    getTeamPointsPerRound : (teamId : number) => {
        const apiUrl = `${apiSettings.apiUrl}team/getTeamPointsPerRound/${teamId}`;
        return axios.get(apiUrl);
    },

    removeSolvedChallenge : (solvedId : number) => {
        const apiUrl = `${apiSettings.apiUrl}team/removeSolvedChallenge/${solvedId}`;
        return axios.post(apiUrl,{}, getAuthorizationHeader());
    },

    getPurchasedHints : (teamId : number) => {
        const apiUrl = `${apiSettings.apiUrl}team/getPurchasedHints/${teamId}`;
        return axios.get(apiUrl);
    },

    removePurchasedHint : (purchasedId : number) => {
        const apiUrl = `${apiSettings.apiUrl}team/removePurchasedHint/${purchasedId}`;
        return axios.post(apiUrl,{}, getAuthorizationHeader());
    },

    kickMember : (teamId : number, userId : number) => {
        const apiUrl = `${apiSettings.apiUrl}team/removeUser/${teamId}/${userId}`;
        return axios.post(apiUrl, {}, getAuthorizationHeader());
    },

    deleteTeam : (teamId : number) => {
        const apiUrl = `${apiSettings.apiUrl}team/delete/${teamId}`;
        return axios.post(apiUrl, {}, getAuthorizationHeader());
    },
}
