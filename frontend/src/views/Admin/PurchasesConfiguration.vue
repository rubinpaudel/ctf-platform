<template>
    <div class="container-fluid pt-5 h-75 d-flex flex-column align-items-center justify-content-center">
        <div class="btn-group mt-3 mb-3">
            <h1 class="dropdown-toggle fw-bolder" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                Purchases
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
                    <router-link to="/admin/points-config" class="dropdown-item">Points</router-link>
                </li>
                <li>
                    <router-link to="/admin/solves-config" class="dropdown-item">Solves</router-link>
                </li>
                <li>
                    <router-link to="#" class="dropdown-item">Purchases</router-link>
                </li>
            </ul>
        </div>

        <div class="container-fluid" v-if="loaded">
            <TeamPurchasedComponent v-for="team in teams" :key="team.Id" :team="team"></TeamPurchasedComponent>
        </div>
        <LoadingIcon v-else/>
</div>

</template>

<script lang="ts">
import TeamPurchasedComponent from '@/components/TeamPurchasedComponent.vue';
import LoadingIcon from '@/components/LoadingIcon.vue';
import {  defineComponent, onBeforeMount, ref } from 'vue';
import { TeamService } from '@/services/TeamService';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';
import { State } from '@/store';

export default defineComponent ({
    components : {TeamPurchasedComponent, LoadingIcon},
    setup () {
        const loaded = ref<boolean>(true);
        const teams= ref<any[]>([]);
        const toast = useToast();
        const store = useStore<State>();

        onBeforeMount(async () => {
            try{
                loaded.value = false;
                teams.value = (await TeamService.getAllTeams()).data.Teams;
                loaded.value = true;

            } catch(e){
                toast.error("Problem loading Teams.");
                loaded.value = false;
            }
        });

        (store.state.SocketIOService?.getSocket)?.on('new-team', async() => {
            teams.value = (await TeamService.getAllTeams()).data.Teams;
        });
        return {teams, loaded}
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
</style>