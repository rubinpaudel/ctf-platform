import { State } from "@/store"
import axios, { AxiosResponse } from "axios"
import { useStore } from "vuex"


export const jwtRefresh = () => {
    axios.interceptors.response.use((res : AxiosResponse) => {

        console.log('In the interceptor');
        // Get the localstorage auth value
        const auth = localStorage.getItem('auth');

        const authObj = JSON.parse(<string>auth);
        // Get the store 
        //
        // console.log(res.headers["token"]);
        // console.log(res)
        // if (token) {
            
        //     console.log("New Token : " + token);

        //     const newToken = token.split(" ")[1]; // In 2 parts Bearer_TOKEN
            
        //     authObj.accessToken = newToken;
        //     localStorage.setItem("auth", JSON.stringify(authObj));

        // }

        return res;
    })
}