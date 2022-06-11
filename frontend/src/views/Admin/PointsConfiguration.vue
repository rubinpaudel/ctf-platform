<template>
    <div class="container-fluid pt-5 h-75 d-flex flex-column align-items-center justify-content-center">
        <div class="btn-group mt-3 mb-3">
            <h1 class="dropdown-toggle fw-bolder" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                Points
            </h1>
            <ul class="dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                <li>
                    <router-link to="/admin/competition-config" class="dropdown-item">Competition</router-link>
                </li>
                <li>
                     <router-link to="/admin/challenge-config" class="dropdown-item">Challenges</router-link>
                </li>
                <li>
                    <router-link to="/admin/team-config" class="dropdown-item">Teams</router-link>
                </li>
                <li>
                    <router-link to="#" class="dropdown-item">Points</router-link>
                </li>
                <li>
                    <router-link to="/admin/solves-config" class="dropdown-item">Solves</router-link>
                </li>
                <li>
                    <router-link to="/admin/purchases-config" class="dropdown-item">Purchases</router-link>
                </li>
            </ul>
        </div>

        <div class="container-fluid table-responsive w-50" v-if="loaded">
            <table class="table table-dark table-striped mx-auto text-center">
                <thead>
                    <tr>
                        <th scope="col">Ranking</th>
                        <th scope="col">Team Name</th>
                        <th scope="col">Captain</th>
                        <th scope="col">Points</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(team, index) in teams" :key="team.Id">
                        <th scope="row">{{index + 1}}</th>
                        <td class="text-truncate">{{team.Name}}</td>
                        <td class="text-truncate">{{team.Captain}}</td>
                        <td><input style="width:50%" type="number" :value="inputFields[index]" @input="changePoints(index,$event.target.value,team.Points)"></td>
                        <td>  
                            <button 
                            type="button"
                            :class="inputFields[index] != team.Points ? 'w-75 rounded-pill green-btn btn-success btn rounded-0 fw-bolder' : 'w-75 rounded-pill red-btn btn-danger btn rounded-0 fw-bolder'"
                            :disabled="inputFields[index] == team.Points"
                            @click="onSaveNewPoints(team.Id, index)"
                            >
                                SAVE
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <LoadingIcon v-if="!loaded"/>
</div>



</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, onMounted, ref } from 'vue';
import LoadingIcon from '@/components/LoadingIcon.vue';
import { TeamService } from '@/services/TeamService';
import { useToast } from 'vue-toastification';

import { useStore } from 'vuex';
import { State } from '@/store';
import { Socket } from 'engine.io-client';
import { SocketIOService } from '@/services/SocketIOService'

export default defineComponent ({
    components : {LoadingIcon},
    setup () {
        const toast = useToast();

        const teams = ref<any[]>([]);
        const inputFields= ref<number[]>([]);
        const loaded = ref<boolean>(true);

        const store = useStore<State>();

        onBeforeMount(async () => {
            try{
                loaded.value = false;
                teams.value = (await TeamService.getAllTeams()).data.Teams;
                teams.value.forEach(t => { inputFields.value.push(t.Points);});
                loaded.value = true;

            } catch(e){
                toast.error("Problem loading Teams.");
                loaded.value = false;
            }
        })

        const onSaveNewPoints = async (teamID : number, index: number) => {

            try{
                const resp = await TeamService.updatePoints(teamID, inputFields.value[index]);  // Update On Server
                teams.value[index].Points = inputFields.value[index];                           // Update On Client
                teams.value.sort((a,b)=>{ return b.Points - a.Points });                        // Sort Teams again on Points
                for (let index = 0; index < teams.value.length; index++) { inputFields.value[index] = teams.value[index].Points;} // Fix order.                            
                toast.success(resp.data.message);

                (store.state.SocketIOService?.getSocket)?.emit('new-team', true);
                (store.state.SocketIOService?.getSocket)?.emit('send-refresh-chart', true);
            } catch (err : any) {
                toast.success(err.response.data.errors)
                err.response.data.errors.forEach((e :any) => toast.error(e))
            }
        }

        const changePoints = (index:number, newPoints: string, p:number) => {
            if(!newPoints){
                inputFields.value[index] = p;
            }else{
                inputFields.value[index] = parseInt(newPoints);
            }
        }
        
        (store.state.SocketIOService?.getSocket)?.on('new-team', async() => {
            teams.value = (await TeamService.getAllTeams()).data.Teams;
            teams.value.forEach((t, index) => { inputFields.value[index]=t.Points;});
        });

        return {
            teams,
            inputFields,
            loaded,
            changePoints,
            onSaveNewPoints
        }
    }

})
</script>

<style scoped lang="scss">
.green-btn {
    background-color: #6EF358 !important;
}
.dropdown-menu {
    text-align: center;
}
.table{
    table-layout: fixed;
}
</style>