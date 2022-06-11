<template>
    <div class="container-fluid pt-5 h-100 d-flex flex-column align-items-center justify-content-center" v-if="loaded">
        <h1 class="d-inline-block text-truncate fw-bolder mb-3" style="max-width: 50%;">{{team.Name}}</h1>
        <div class="container py-3 ">
            <table class="table table-dark">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Points</th>
                            <th scope="col">Attempts</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody v-if="team">
                        <tr v-for="member in team.Members" :key="member.Id">
                            <td>
                                <BIconStarFill v-if="member.Id == team.Captain.Id" class="text-warning"></BIconStarFill>
                                {{member.Name}}
                            </td>
                            <td>{{member.Points}}</td>
                            <td>{{member.Attempts.length}}</td>
                            <td>
                                <button
                                v-if="(store.state.jwtPayload?.UserID == team.Captain.Id) && (member.Id !== team.Captain.Id)" 
                                class="btn btn-danger w-75 bg-danger rounded-pill fw-bolder" 
                                @click="kickMemberId = member.Id"
                                data-bs-toggle="modal" :data-bs-target="'#'+dialogs.kick"
                                >{{dialogs.kick}}</button>
                            </td>
                        </tr>
                  </tbody>
            </table>
        </div>
        <button class="btn btn-danger bg-danger rounded-pill w-25 fw-bolder" v-if="(store.state.jwtPayload?.UserID == team.Captain.Id)" data-bs-toggle="modal" :data-bs-target="'#'+dialogs.delete"> Delete Team </button>
        <button class="btn btn-danger bg-danger rounded-pill w-25 fw-bolder" v-if="(store.state.jwtPayload?.UserID != team.Captain.Id)" data-bs-toggle="modal" :data-bs-target="'#'+dialogs.leave"> Leave Team </button>

        <div class="container-fluid">
            
            <div class="container d-flex flex-column py-3">

                <div class="header d-flex flex-row justify-content-between">
                    <span class="fs-5 fw-bolder my-3">Solved Challenges</span>
                </div>
                <hr class="bg-light" />
                <div class="row w-100" v-if="solvedChallenges.length > 0">
                    <div class="col-3 mb-4" v-for="challenge in solvedChallenges" :key="challenge.Id">

                        <div class="card rounded-3 text-dark fw-bolder pt-0" >
                            <div class="card-body d-flex flex-column align-items-center">
                                <p>{{ challenge.Challenge.Name }}</p>
                                <p class="text-success">{{ challenge.Challenge.Points }}</p>
                                <span> {{challenge.SolvedBy.User}}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <SureDialogComponent :onConfirmed="kickMember"  :Id="dialogs.kick" :Message="dialogs.kick"/>
        <SureDialogComponent :onConfirmed="deleteTeam"  :Id="dialogs.delete" :Message="dialogs.delete"/>
        <SureDialogComponent :onConfirmed="leaveTeam"   :Id="dialogs.leave" :Message="dialogs.leave"/>
        
    </div>
</template>

<script lang="ts">
import { TeamService } from '@/services/TeamService';
import { UserService } from '@/services/UserService';
import SureDialogComponent from '@/components/SureDialogComponent.vue';
import { State } from '@/store';
import { defineComponent, ref, onBeforeMount } from 'vue'
import { useStore } from 'vuex';

import { BIconStarFill } from 'bootstrap-icons-vue';
import { useToast } from 'vue-toastification';
import router from '@/router';


export default defineComponent({
    components : {BIconStarFill, SureDialogComponent},
    setup () {
        const dialogs = {kick :"KICK", delete : "DELETE", leave: "LEAVE"};

        const toast = useToast();
        const store = useStore<State>();
        const team = ref<any>(null);
        const solvedChallenges = ref<any[]>([]);
        const loaded = ref<boolean>(true);
        const kickMemberId = ref<number>(-1);

        const kickMember = async () => {
            try {
                const response = await TeamService.kickMember(team.value.Id, kickMemberId.value);
                toast.success(response.data.message);
                team.value.Members = team.value.Members.filter((member: any)=> member.Id !== kickMemberId.value);

                (store.state.SocketIOService?.getSocket)?.emit('kick-member', {teamId: team.value.Id, kickedId: kickMemberId.value });
                (store.state.SocketIOService?.getSocket)?.emit('send-refresh-chart', true); 
            } catch (err : any) {
                toast.error(err.response.data?.errorMessage);
            }
        }
        const deleteTeam = async() => {
            try{
                const response = await TeamService.deleteTeam(team.value.Id);
                toast.success(response.data.message);
                store.dispatch("HasTeam", false);
                router.push("find");

                (store.state.SocketIOService?.getSocket)?.emit('delete-team', {teamId: team.value.Id, memberIds: team.value.Members.map((member: any)=> member.Id) });
                (store.state.SocketIOService?.getSocket)?.emit('send-refresh-chart', true); 
            } catch(err: any){
                toast.error(err.response.data?.errorMessage);
            }
        }
        const leaveTeam = async() => {
            try{
                const response = await UserService.leaveTeam();
                toast.success(response.data.message);
                store.dispatch("HasTeam", false);
                router.push("find");

                (store.state.SocketIOService?.getSocket)?.emit('leave-team', {teamId: team.value.Id, userId: store.state.jwtPayload?.UserID });
                (store.state.SocketIOService?.getSocket)?.emit('send-refresh-chart', true); 
            } catch(err: any){
                toast.error(err.response.data?.errorMessage);
            }
        }
        onBeforeMount( async () => {

            loaded.value = false;
            if(!(await UserService.hasTeam()).data.hasTeam) {
                store.dispatch("HasTeam", false);
                router.push("find");
                return
            }

            try{
                const teamId = (await TeamService.getUserTeam(store.state.jwtPayload?.UserID as number)).data.TeamId;
                team.value = (await TeamService.getTeamMembers(teamId)).data.Team;
                solvedChallenges.value = (await TeamService.getSolvedChallenges(teamId)).data.solvedChallenges;
                loaded.value = true;
            }catch(e: any){
                loaded.value = false;
                store.dispatch("HasTeam", false);
                router.push("find");
            }
            
        });

            (store.state.SocketIOService?.getSocket)?.on('kick', async() => {
            console.log("Member change or delete")
            if(!(await UserService.hasTeam()).data.hasTeam) {
                store.dispatch("HasTeam", false);
                router.push("find");
                return
            }
            else{
                const teamId = (await TeamService.getUserTeam(store.state.jwtPayload?.UserID as number)).data.TeamId;
                team.value.Members = (await TeamService.getTeamMembers(teamId)).data.Team.Members;
                solvedChallenges.value = (await TeamService.getSolvedChallenges(teamId)).data.solvedChallenges;
            }
            (store.state.SocketIOService?.getSocket)?.emit('id');
        });

        // When new teamsize
        (store.state.SocketIOService?.getSocket)?.on('new-member', async() => {
            console.log("Member change or delete")
            if(!(await UserService.hasTeam()).data.hasTeam) {
                store.dispatch("HasTeam", false);
                router.push("find");
                return
            }
            else{
                const teamId = (await TeamService.getUserTeam(store.state.jwtPayload?.UserID as number)).data.TeamId;
                team.value.Members = (await TeamService.getTeamMembers(teamId)).data.Team.Members;
                solvedChallenges.value = (await TeamService.getSolvedChallenges(teamId)).data.solvedChallenges;
            }
            (store.state.SocketIOService?.getSocket)?.emit('id');
        });

        (store.state.SocketIOService?.getSocket)?.on('new-solve', async() => {
            const teamId = (await TeamService.getUserTeam(store.state.jwtPayload?.UserID as number)).data.TeamId;
            team.value.Members = (await TeamService.getTeamMembers(teamId)).data.Team.Members;
            solvedChallenges.value = (await TeamService.getSolvedChallenges(teamId)).data.solvedChallenges;
        });

        return { team, store, solvedChallenges, kickMember, deleteTeam,loaded, leaveTeam, kickMemberId, dialogs }
    }
})
</script>

<style scoped lang="scss">

</style>