<template>
    <div class="container d-flex flex-column py-3" v-if="solves.length > 0">

        <div class="header d-flex flex-row justify-content-between">
            <span>{{ team.Name }}</span>
        </div>

        <hr class="bg-light" />

        <div class="container-fluid">

            <div class="row w-100">
                <div class="col-3 mb-4" v-for="solve in solves" :key="solve.Challenge.Id">
                    <div class="card rounded-3 text-dark fw-bolder">
                        <div class="card-body d-flex flex-column align-items-center">
                            <p>{{ solve.Challenge.Name }}</p>
                            <p>{{ solve.Challenge.Points }}</p>
                            <BIconTrash class="fs-2 mx-2" style="color:red" @click="deleteSolve(solve.Id)"></BIconTrash>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    </div>

</template>

<script lang="ts">
import { TeamService } from '@/services/TeamService';
import { defineComponent, ref, onBeforeMount } from 'vue'
import {BIconTrash} from 'bootstrap-icons-vue'
import { useToast } from 'vue-toastification';

import { useStore } from 'vuex';
import { State } from '@/store';
import { Socket } from 'engine.io-client';
import { SocketIOService } from '@/services/SocketIOService'

export default defineComponent({
    components : {BIconTrash},
    props: { team : Object},
    setup (props) {
        
        const toast = useToast();
        const solves = ref<any[]>([]);

        const store = useStore<State>();

        onBeforeMount(async () => {
            try{
                solves.value = (await TeamService.getSolvedChallenges(props.team?.Id)).data.solvedChallenges;
            } catch(e){
                toast.error("Problem loading solves!");
            }
        })

        const deleteSolve = async (solvedId:number) => {
            try {
                let a = solves.value.filter(solve => solve.Id == solvedId);
                const response = await TeamService.removeSolvedChallenge(solvedId);
                toast.success(`Successfully deleted!`);
                solves.value = solves.value.filter(solve => solve.Id !== solvedId);
                (store.state.SocketIOService?.getSocket)?.emit('delete-solve', (a[0].SolvedBy.TeamId));
                (store.state.SocketIOService?.getSocket)?.emit('new-team');
                (store.state.SocketIOService?.getSocket)?.emit('send-refresh-chart', true);

            } catch (err : any) {
                toast.error("Couldn't delete solve.")
            }

        };

        (store.state.SocketIOService?.getSocket)?.on('new-team', async() => {
            solves.value = (await TeamService.getSolvedChallenges(props.team?.Id)).data.solvedChallenges;
        });

        return {solves, deleteSolve}
    }
})
</script>

<style scoped lang="scss">
</style>