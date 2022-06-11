import { TeamService } from "@/services/TeamService";
import { NavigationGuardNext, RouteLocation } from "vue-router";

export const teamGuard = async (to : any, from : any, next : any) => {

    // Only gets to the teamguard if user is authenticates
    const auth = <string>localStorage.getItem("auth");
    const authObj = JSON.parse(auth);
    
    // if user is an admin let them pass through
    if (authObj.loggedIn && authObj.accessToken && authObj.payload.isAdmin) next()
    else {
        // If user is not an admin get the user's team ID
        //let userTeam = await TeamService.getUserTeam(authObj.payload.UserID);
        // if the user has no team then re route to join team page
        if ((to.name == 'find-team' || to.name == 'create-team') && !authObj.hasTeam) next()
        else if (!authObj.hasTeam) next({name : 'find-team'})
        else if (authObj.hasTeam && to.name == 'team-overview') next()
        else if (authObj.hasTeam && to.name != 'team-overview') next({name : 'team-overview'})

    }

}