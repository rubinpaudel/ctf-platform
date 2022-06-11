import { apiSettings } from "@/api/apiSettings";
import { getAuthorizationHeader } from "@/helpers/getAuthorizationHeader";
import { UserCategory, Search } from "@/types";
import axios from "axios";

export type _UserService = {
    getUserCategory : () => Promise<any>,
    createCategory : (c : UserCategory) => Promise<any>,
    deleteCategory : (id : number) => Promise<any>,
    updateCategoryName : (id : number, name : string) => Promise<any>,
    updateCategoryLevel : (id : number, level : number) => Promise<any>,
    hasTeam : () => Promise<any>
    leaveTeam : () => Promise<any>,
    nameAvailable: (name: string) => Promise<any>,
    getAllUsers: (searchP : Search) => Promise<any>,
    deleteUser: (userId: number) => Promise<any>,

    myCategory : () => Promise<any>
    myName : () => Promise<any>
    myEmail : () => Promise<any>
}


export const UserService : _UserService = {

    getUserCategory : () => {
        const apiUrl = `${apiSettings.apiUrl}user/categories`;
        return axios.get(apiUrl);
    },

    deleteUser: (userId: number) =>{
        const apiUrl = `${apiSettings.apiUrl}user/delete/${userId}`;
        return axios.post(apiUrl, {}, getAuthorizationHeader());
    },

    nameAvailable: (name: string) => {
        const apiUrl = `${apiSettings.apiUrl}user/nameAvailable/${name}`;
        return axios.get(apiUrl);
    },

    createCategory : (category : UserCategory) => {
        const apiUrl = `${apiSettings.apiUrl}user/category`;
        return axios.post(apiUrl, {CategoryName : category.Name}, getAuthorizationHeader());
    },

    deleteCategory : (id : number) => {
        const apiUrl = `${apiSettings.apiUrl}user/category/${id}`;
        return axios.delete(apiUrl, getAuthorizationHeader());
    },

    updateCategoryName : (id : number, name : string) => {
        const apiUrl = `${apiSettings.apiUrl}user/categoryName/${id}`;
        return axios.put(apiUrl, {CategoryName : name}, getAuthorizationHeader());
    },

    updateCategoryLevel : (id : number, level : number) => {
        const apiUrl = `${apiSettings.apiUrl}user/categoryLevel/${id}`;
        return axios.put(apiUrl, {CategoryLevel : level}, getAuthorizationHeader());
    },

    hasTeam : () => {
        const apiUrl = `${apiSettings.apiUrl}user/team`;
        return axios.get(apiUrl, getAuthorizationHeader());
    },

    leaveTeam: () => {
        const apiUrl = `${apiSettings.apiUrl}user/leaveTeam`;
        return axios.post(apiUrl, {}, getAuthorizationHeader());
    },

    myCategory : () => {
        const apiUrl = `${apiSettings.apiUrl}user/myCategory`;
        return axios.get(apiUrl, getAuthorizationHeader());
    },

    myName : () => {
        const apiUrl = `${apiSettings.apiUrl}user/myName`;
        return axios.get(apiUrl, getAuthorizationHeader());
    },

    myEmail : () => {
        const apiUrl = `${apiSettings.apiUrl}user/myEmail`;
        return axios.get(apiUrl, getAuthorizationHeader());
    },
    
    getAllUsers : (searchP : Search) => {
        const apiUrl = `${apiSettings.apiUrl}user/listUsers?filterName=${searchP.FilterName}&sortDirection=${searchP.SortDirection}&sortBy=${searchP.SortBy}&filterCategory=${searchP.FilterCategory}`;
        return axios.get(apiUrl, getAuthorizationHeader());
    }


};