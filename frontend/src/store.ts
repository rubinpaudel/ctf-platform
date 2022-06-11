import { AxiosError, AxiosResponse } from 'axios';
import {Action, createStore, Store} from 'vuex'
import { AuthService } from './services/AuthService';
import { SocketIOService } from './services/SocketIOService';
import { UserService } from './services/UserService';
import { JwtPayload, Login } from './types';




export interface State {
    accessToken : string | null,
    jwtPayload : JwtPayload | null,
    loggedIn : boolean,
    logInError : any,
    hasTeam : boolean,
    SocketIOService?: SocketIOService 
}



const getInitialState = () : State => {

    const auth = localStorage.getItem('auth');
    if (auth == null)
        return { accessToken : null, jwtPayload: null, loggedIn : false, logInError : null, hasTeam : false}
    
    const authObj = JSON.parse(auth);
    return {accessToken : authObj.accessToken, jwtPayload : authObj.payload, loggedIn : authObj.loggedIn, logInError : null, hasTeam : authObj.hasTeam}

}


export const store = createStore<State>({

    state() { return getInitialState(); },

    actions : {
        LogIn({commit}, payload : Login) {
            return new Promise((resolve, reject) => {
                AuthService.login(payload)
                .then(async (response : AxiosResponse) => {
                    // Successfully Logged In
                    const jpayload = AuthService.parseJWTData(response.data.token);
                    
                    const authObj = {accessToken : response.data.token, loggedIn : true, payload : jpayload, hasTeam : this.state.hasTeam};
                    // Set in LocalStorage
                    localStorage.setItem("auth", JSON.stringify(authObj));
                    
                    commit('LogIn');
                    commit('setJwtPayload', jpayload);
                    commit('setAccessToken', response.data.token);
                    if (!jpayload.isAdmin) {
                        try {
                            const userTeam = await UserService.hasTeam();
                            authObj.hasTeam = userTeam.data.hasTeam;
                            localStorage.setItem("auth", JSON.stringify(authObj));
                    
                            commit('setHasTeam', userTeam.data.hasTeam);
                        } catch (error) {
                            console.log(error)
                        }
                    }
                    resolve(null);
                }).catch((err : AxiosError) => {
                    commit('setLogInError', err.response?.data);
                    reject(err);
                })
            })

        },
        LogOut({commit}) {
            localStorage.removeItem("auth");
            commit("setAccessToken", null);
            commit("setJwtPayload", null);
            commit("setHasTeam", false);
            commit("LogOut");
        },
        HasTeam({commit}, payload: boolean) {
            commit("setHasTeam", payload);
            const authObj = {accessToken : this.state.accessToken, loggedIn : this.state.loggedIn, payload : this.state.jwtPayload, hasTeam : this.state.hasTeam};
            localStorage.setItem("auth", JSON.stringify(authObj));
        }
    },

    mutations : {
        setAccessToken : (state : State, accessToken : string) => {
            state.accessToken = accessToken;
        },
        setJwtPayload : (state : State, JwtPayload : JwtPayload) => {
            state.jwtPayload = JwtPayload;
        },
        setLogInError : (state : State, err : any) => state.logInError = err,
        LogIn : (state : State) => state.loggedIn = true,
        LogOut: (state : State) => state.loggedIn = false,
        setHasTeam : (state : State, hasTeam : boolean) => state.hasTeam = hasTeam,
        setSocket : (state : State, socket : SocketIOService) => state.SocketIOService = socket,
    }
});