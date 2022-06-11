<template>
    <div class="container-fluid d-flex flex-column align-items-center justify-content-center">
        <div class="btn-group mt-5 mb-2">
            <h1 class="dropdown-toggle fw-bolder fs-1" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                {{
                    currentRound ? currentRound.Name : "No Active Round"
                }}
            </h1>
            <ul class="dropdown-menu w-100" aria-labelledby="dropdownMenuButton">

                <li v-for="round in rounds" :key="round.Id">
                    <a class="dropdown-item" @click="onChangeRound(round)">{{round.Name}}</a>
                </li>
            </ul>
        </div>

        <h2 class="fw-bolder fs-5">
            {{
                currentRound ? currentRound.Description : ""
            }}
        </h2>

        <h3 class="fw-bolder fs-5">
            {{
                currentRound ? showDateFunc() : ""
            }}
        </h3>

        <div class="container-fluid" v-if="currentRound != null" :key="refresh">
            <ChallengeCategoryComponent v-for="category in categories" :key="category.Id" :category="category" :round="currentRound.Id"></ChallengeCategoryComponent>
        </div>


    </div>
</template>

<script lang="ts">

import ChallengeCategoryComponent from '@/components/ChallengeCategoryComponent.vue';
import { ChallengeService } from '@/services/ChallengeService';
import { RoundService } from '@/services/RoundService';
import { CompetitionService } from "@/services/CompetitionService";
import { defineComponent, onBeforeMount, ref } from 'vue'
import { useStore } from 'vuex';
import { State } from '@/store';
import router from '@/router';
import { UserService } from '@/services/UserService';
export default defineComponent({
    components : {ChallengeCategoryComponent},
    setup () {
        const store = useStore<State>();
        const refresh = ref<number>(0);
        const categories= ref<any[]>([]);
        const rounds = ref<any[]>([]);
        const currentRound = ref<any>(null);

        const onChangeRound = (round : any) => {
            currentRound.value = round;
            refresh.value += 1;
        }

        const showDateFunc = () => {


            let StartHour = (new Date(currentRound.value.StartTime)).getHours();
            let StartHourString = '';
            if(StartHour - 2 < 10 && StartHour - 2 >= 0){
                StartHourString += '0';
            }
            if(StartHour - 2 < 0){
                StartHourString += (StartHour + 24 - 2)
            }
            else{
                StartHourString += (StartHour - 2)
            }


            let StartMinute = (new Date(currentRound.value.StartTime)).getMinutes();
            let StartMinuteString = '';
            if(StartMinute < 10){
                StartMinuteString += '0';
            }
            StartMinuteString += StartMinute;


            let EndHour = (new Date(currentRound.value.EndTime)).getHours();
            let EndHourString = '';
            if(EndHour - 2 < 10 && EndHour - 2 >= 0){
                EndHourString += '0';
            }
            if(EndHour - 2 < 0){
                EndHourString += (EndHour + 24 - 2);
            }
            else{
                EndHourString += (EndHour - 2);
            }


            let EndMinute = (new Date(currentRound.value.EndTime)).getMinutes();
            let EndMinuteString = '';
            if(EndMinute < 10){
                EndMinuteString += '0';
            }
            EndMinuteString += EndMinute;


            let dateString = StartHourString + ':' + StartMinuteString + ' - ' + EndHourString + ':' + EndMinuteString;
            return dateString;
        }

        onBeforeMount(async () => {
            let hasTeam = (await UserService.hasTeam()).data.hasTeam;
            if(!store.state.jwtPayload?.isAdmin && !hasTeam) {router.push("/team/find");}
            categories.value = (await ChallengeService.getChallengeCategory()).data.ChallengeCategories;
            rounds.value = (await RoundService.getRounds()).data.Rounds;
            rounds.value.forEach((r) => {
                
                const start : Date = new Date(r.StartTime);
                
                const end : Date = new Date(r.EndTime);
                
                const now : Date = new Date();
                now.setHours(now.getHours()+2);

                if (start.getTime() <= now.getTime() && now.getTime() <= end.getTime()){    
                    currentRound.value = r;
                }
                    
            })
        });

        (store.state.SocketIOService?.getSocket)?.on('new-challengecategory', async() => {
            categories.value = (await ChallengeService.getChallengeCategory()).data.ChallengeCategories;
        });

        (store.state.SocketIOService?.getSocket)?.on('new-time', async() => {
            rounds.value = (await RoundService.getRounds()).data.Rounds;
            rounds.value.forEach((r) => {
                
                const start : Date = new Date(r.StartTime);

                const end : Date = new Date(r.EndTime);
                
                const now : Date = new Date();
                now.setHours(now.getHours()+2);

                if (start.getTime() <= now.getTime() && now.getTime() <= end.getTime()){
                    currentRound.value = r;
                }
                    
            })
            const auth = localStorage.getItem("auth");
            if (auth != null) {

                const authObj = JSON.parse(auth);
                if (!authObj.payload.isAdmin){
                    const competitionStart = new Date((await CompetitionService.getCompetitionStartDate()).data.CompetitionStartDate);
                    const currentDate = new Date();
                    if (competitionStart.getTime() > currentDate.getTime()) { router.push({path: '/competition-404'});}
                    else{
                        router.push({path: '/challenges'});
                    }
                }
            }
            refresh.value += 1;
        });

        (store.state.SocketIOService?.getSocket)?.on('new-round', async() => {
            console.log("NEW ROUND")
            rounds.value = (await RoundService.getRounds()).data.Rounds;
            rounds.value.forEach((r) => {
                
                const start : Date = new Date(r.StartTime);

                const end : Date = new Date(r.EndTime);
                
                const now : Date = new Date();
                now.setHours(now.getHours()+2);

                if (start.getTime() <= now.getTime() && now.getTime() <= end.getTime()){
                    currentRound.value = r;
                }

            })
        });

        return {categories, rounds, currentRound, showDateFunc, onChangeRound, refresh}
    }
})
</script>

<style scoped lang="scss">


</style>