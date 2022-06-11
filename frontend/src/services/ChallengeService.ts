import { apiSettings } from "@/api/apiSettings";
import { getAuthorizationHeader } from "@/helpers/getAuthorizationHeader";
import { ChallengeCategory, Challenge } from "@/types";

import axios from "axios";

export type _ChallengeService = {
    getChallengeCategory : () => Promise<any>,
    getChallenges : (r : number, c : number ) => Promise<any>,
    getChallengeById : (id : number) => Promise<any>,
    editChallenge : (Challenge: Challenge, id : number) => Promise<any>,
    listChallenges : () => Promise<any>,
    getSolvedChallenges : (t : number) => Promise<any>,
    createNewCategory : (c :  ChallengeCategory) => Promise<any>,
    deleteCategory : (id : number) => Promise<any>,
    updateCategory : (id : number, name : string) => Promise<any>,
    updateStatus : (id : number, status : boolean) => Promise<any>,
    createChallenge : (nnc : Challenge, attachments : any[] | null) => Promise<any>,
    deleteChallenge : (id : number) => Promise<any>,
    getChallengeAttachments : (id : number) => Promise<any>,
    getChallengeAttachmentById : (id : number) => Promise<any>,
    getAttachmentName : (id : number) => Promise<any>,
    submitFlag : (id : number, flag: string) => Promise<any>,
    completeQuiz : (id : number) => Promise<any>,
    getFlags : (id : number) => Promise<any>,
    deleteAttachment : (id : number) => Promise<any>,
    addAttachments : (id : number, attachments : any[]) => Promise<any>,
}


export const ChallengeService : _ChallengeService = {

    addAttachments : (id : number, attachments : any[]) => {
        const apiUrl = `${apiSettings.apiUrl}attachment/${id}`;
        const formData = new FormData();
        attachments.forEach(file => { formData.append('Attachments', file) });
        return axios.post(apiUrl, formData, getAuthorizationHeader());
    },
    deleteAttachment : (id : number) => {
        const apiUrl = `${apiSettings.apiUrl}attachment/${id}`;
        return axios.delete(apiUrl,getAuthorizationHeader());
    },

    getFlags : (id : number) => {
        const apiUrl = `${apiSettings.apiUrl}flags/${id}`;
        return axios.get(apiUrl,getAuthorizationHeader());
    },
    editChallenge : (Challenge: Challenge, id : number) => {
        const apiUrl = `${apiSettings.apiUrl}team/editChallenge/${id}`;
        return axios.put(apiUrl, {Challenge: Challenge.Challenge}, getAuthorizationHeader());
    },
    completeQuiz : (id : number) => {
        const apiUrl = `${apiSettings.apiUrl}team/completeQuiz/${id}`;
        return axios.post(apiUrl, {}, getAuthorizationHeader());
    },

    submitFlag : (id : number, flag: string) => {
        const apiUrl = `${apiSettings.apiUrl}flags/submit/${id}`;
        return axios.post(apiUrl, {Flag: flag}, getAuthorizationHeader());
    },

    getChallengeAttachments : (id : number) => {
        const apiUrl = `${apiSettings.apiUrl}attachment/${id}`;
        return axios.get(apiUrl, getAuthorizationHeader());
    },

    getAttachmentName : (id : number) => {
        const apiUrl = `${apiSettings.apiUrl}attachment/name/${id}`;
        return axios.get(apiUrl, getAuthorizationHeader());
    },

    getChallengeAttachmentById : (id : number) => {
        const apiUrl = `${apiSettings.apiUrl}attachment/one/${id}`;
        return axios.get(apiUrl, {responseType:"blob"});
    },
    getChallengeById : (id : number) => {
        const apiUrl = `${apiSettings.apiUrl}challenge/${id}`;
        return axios.get(apiUrl);
    },
    getChallengeCategory : () => {
        const apiUrl = `${apiSettings.apiUrl}challenge/categories`;
        return axios.get(apiUrl);
      
    },
    listChallenges : () => {
        const apiUrl = `${apiSettings.apiUrl}challenge/`;
        return axios.get(apiUrl, getAuthorizationHeader());
    },

    getChallenges : (round : number, category : number) => {
        const apiUrl = `${apiSettings.apiUrl}challenge/${round}/${category}`;
        return axios.get(apiUrl, getAuthorizationHeader());
    },

    getSolvedChallenges : (team : number) => {
        const apiUrl = `${apiSettings.apiUrl}team/getSolvedChallenges/${team}`;

        return new Promise<any>((resolve, reject) => {
            axios.get(apiUrl)
            .then((response) => {
                resolve(response)
            })
            .catch((err) => {
                reject(err);
            })
        })
    },

    createNewCategory : (c :  ChallengeCategory) => {
        const apiUrl = `${apiSettings.apiUrl}challenge/category`;
        return axios.post(apiUrl, {CategoryName : c.Name}, getAuthorizationHeader())
    },

    deleteCategory : (id : number) => {
        const apiUrl = `${apiSettings.apiUrl}challenge/category/${id}`;
        return axios.delete(apiUrl, getAuthorizationHeader());
    },
    updateCategory : (id : number, name : string) => {
        const apiUrl = `${apiSettings.apiUrl}challenge/category/${id}`;
        return axios.put(apiUrl, {CategoryName : name}, getAuthorizationHeader());
    },

    updateStatus : (id : number, status : boolean) => {
        const apiUrl = `${apiSettings.apiUrl}challenge/status/${id}`;
        return axios.put(apiUrl, {Status : status}, getAuthorizationHeader());
    },

    createChallenge : (nnc : Challenge, attachments : any[] | null) => {

        const apiUrl = `${apiSettings.apiUrl}challenge/create`;
        const formData = new FormData();
        
        formData.append('data', JSON.stringify(nnc));

        if (attachments) {
            attachments.forEach(file => {
                formData.append('Attachments', file)
            });
        }
        
        return axios.post(apiUrl, formData, getAuthorizationHeader());

    },
    deleteChallenge : (id : number) => {
        const apiUrl = `${apiSettings.apiUrl}challenge/${id}`;
        return axios.delete(apiUrl, getAuthorizationHeader());
    }

};


