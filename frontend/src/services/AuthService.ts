import { apiSettings } from "@/api/apiSettings";
import axios, { AxiosResponse } from "axios";
import { JwtPayload, Login, Register, RegisterAdmin } from "@/types";
import { getAuthorizationHeader } from "@/helpers/getAuthorizationHeader";

export type _AuthService = {
    parseJWTData : (jwtToken : string) => JwtPayload 
    login : (login : Login) => Promise<any>,
    register : (register : Register) => Promise<any>,
    registerAdmin : (register : RegisterAdmin) => Promise<any>,
    resetPassword : (email : string) => Promise<any>,
    changePasswordWithCode : (code : string, Password : string, PasswordConfirm : string) => Promise<any>,
}


export const AuthService : _AuthService = {

    changePasswordWithCode : (code : string, Password : string, PasswordConfirm : string) => {
        const apiUrl = `${apiSettings.apiUrl}auth/reset-password/`;
        return axios.post(apiUrl, {Password: Password, PasswordConfirm: PasswordConfirm, ResetCode : code});
    },

    resetPassword : (email : string) => {
        const apiUrl = `${apiSettings.apiUrl}auth/reset-password/${email}`;

        return axios.get(apiUrl);

    },

    login : (login : Login) => {

        const apiUrl = `${apiSettings.apiUrl}auth/login`;

        return axios.post(apiUrl, login);
    },

    register :  (register : Register) => {

        const apiUrl = `${apiSettings.apiUrl}auth/register`;

        return axios.post(apiUrl, register);
    },

    registerAdmin :  (register : RegisterAdmin) => {

        const apiUrl = `${apiSettings.apiUrl}auth/registerAdmin`;

        return axios.post(apiUrl, register, getAuthorizationHeader());
    },

    parseJWTData : (jwtToken : string) => {
        const base64Url = jwtToken.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    }

};