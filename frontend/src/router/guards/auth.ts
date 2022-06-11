import { NavigationGuardNext, RouteLocation } from "vue-router";
export const authGuard = (to : any, from : any, next : any) => {

    const auth = localStorage.getItem("auth");
    
    if (auth == null && to.name != 'login')
      next({name: 'login'})
  
    if (to.name == 'login' && auth == null)
      next();
  

  
    const authObj = JSON.parse(<string>auth);
  
    if ((!authObj.loggedIn || !authObj.accessToken) && to.name != 'login') next({name : 'login'})

    if (!authObj.loggedIn && to.name == 'login') next()
    if (authObj.loggedIn && (to.name == 'login' || to.name == 'register')) next({name : 'challenges'})
    
    next();
}