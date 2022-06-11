import { CompetitionService } from "@/services/CompetitionService";
import axios from "axios";
import { NavigationGuardNext, RouteLocation } from "vue-router";

export const competitionGuard = async (to : RouteLocation, from : RouteLocation, next : NavigationGuardNext) => {


    // If the user is an admin let them access the route
    const auth = localStorage.getItem("auth");

    if (auth != null) {

        const authObj = JSON.parse(auth);
        if (authObj.payload.isAdmin)
            next();
    }

    const competitionStart = new Date((await CompetitionService.getCompetitionStartDate()).data.CompetitionStartDate);
    

    
    const currentDate = new Date();

    if (competitionStart.getTime() > currentDate.getTime()) {
        
        // Competition has not started yet!
        return next({path: '/competition-404'});
    }
    
    next();
}