import { apiSettings } from "@/api/apiSettings";
import { getAuthorizationHeader } from "@/helpers/getAuthorizationHeader";

import axios from "axios";

export type _DockerService = {
    getImages : () => Promise<any>,
    createContainer : (DockerImage : any) => Promise<any>,
    startContainer : (DockerImage : any) => Promise<any>,
    stopContainer : (DockerImage : any) => Promise<any>,
    containerIsRunning : (DockerImage : any) => Promise<any>,
    getPorts : (id : number) => Promise<any>,
    getPortsByChallenge : (challengeID : number) => Promise<any>
}


export const DockerService : _DockerService = {

    getPortsByChallenge : (challengeID : number) => {
        const apiUrl = `${apiSettings.apiUrl}docker/image/challenge-ports/${challengeID}`;
        return axios.get(apiUrl, getAuthorizationHeader());
    },
    getPorts : (id : number) => {
        const apiUrl = `${apiSettings.apiUrl}docker/image/ports/${id}`;
        return axios.get(apiUrl, getAuthorizationHeader());
    },
    getImages : () => {
        const apiUrl = `${apiSettings.apiUrl}docker/image/`;
        return axios.get(apiUrl, getAuthorizationHeader());
    },

    createContainer : (DockerImage : any) => {

        const apiUrl = `${apiSettings.apiUrl}docker/container/create/`;
        return axios.post(apiUrl, {ChallengeID : DockerImage.Challenge.Id}, getAuthorizationHeader());
    },
    
    startContainer : (DockerImage : any) => {
        const apiUrl = `${apiSettings.apiUrl}docker/container/start/`;
        return axios.post(apiUrl, {ContainerName : DockerImage.Container?.Name}, getAuthorizationHeader());

    },
    
    stopContainer : (DockerImage : any) => {
        const apiUrl = `${apiSettings.apiUrl}docker/container/stop/`;
        return axios.post(apiUrl, {ContainerName : DockerImage.Container?.Name}, getAuthorizationHeader());
    },

    containerIsRunning : (DockerImage : any) => {
        const apiUrl = `${apiSettings.apiUrl}docker/container/isRunning/`;
        return axios.post(apiUrl, {ContainerName : DockerImage.Container?.Name}, getAuthorizationHeader());
    },

};


