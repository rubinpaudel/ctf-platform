<template>
    <div class="container-fluid pt-5 h-75 d-flex flex-column align-items-center justify-content-center">
        <h1 class="fw-bolder mb-3">TEAMS</h1>

        <div class="container-fluid table-responsive">
            <table class="table table-dark table-striped mx-auto" style="max-width: 80%">
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
                        <td>{{team.Name}}</td>
                        <td>{{team.Captain}}</td>
                        <td><input type="number" :value="inputFields[index]" @input="changePoints(index,$event.target.value,team.Points)"></td>
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
</div>



</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, onMounted, ref } from 'vue';
import { TeamService } from '@/services/TeamService';
import { useToast } from 'vue-toastification';

//TODO : Add proper functionality.

export default defineComponent ({
    components : {},
    setup () {
        const toast = useToast();

        const teams = ref<any[]>([]);
        const inputFields= ref<number[]>([]);

        onBeforeMount(async () => {
            teams.value = (await TeamService.getAllTeams()).data.Teams;
            teams.value.forEach(t => { inputFields.value.push(t.Points);});
        })

        const onSaveNewPoints = async (teamID : number, index: number) => {

            try{
                const resp = await TeamService.updatePoints(teamID, inputFields.value[index]);  // Update On Server
                teams.value[index].Points = inputFields.value[index];                           // Update On Client
                teams.value.sort((a,b)=>{ return b.Points - a.Points });                        // Sort Teams again on Points
                for (let index = 0; index < teams.value.length; index++) { inputFields.value[index] = teams.value[index].Points;} // Fix order.                            
                toast.success(resp.data.message);
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
        
        return {
            teams,
            inputFields,
            changePoints,
            onSaveNewPoints,
        }
    }

})
</script>

<style scoped lang="scss">
.green-btn {
    background-color: #6EF358 !important;
}
</style>