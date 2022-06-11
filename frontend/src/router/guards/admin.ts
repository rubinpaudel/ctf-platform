import { NavigationGuardNext, RouteLocation } from "vue-router";

export const adminGuard = (to : RouteLocation, from : RouteLocation) => {

    const auth = localStorage.getItem("auth");
  
    if (auth == null)
      return {name : 'login'}
    
    const authObj = JSON.parse(auth);
  
    if (!authObj.loggedIn || !authObj.accessToken || !authObj.payload.isAdmin)
        return {name : 'login'}
  
    if (to.name == 'login' || to.name == 'register')
        return {name : 'challenge-config'} 
}