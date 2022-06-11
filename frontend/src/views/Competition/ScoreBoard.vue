<template>

    <div class="container-fluid h-75 d-flex flex-column align-items-center justify-content-center" v-if="loaded">

        <div class="d-flex flex-row justify-content-between w-75 mt-4 mb-2">

            <div>
                <h1 class="fs-4" style="visibility : hidden" id="dropdownFilterButton" data-bs-toggle="dropdown" aria-expanded="false">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-filter" viewBox="0 0 16 16">
                    <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
                    </svg>
                    Filter
                </h1>
            </div>

            <div class="dropdown">
                <h1 class="dropdown-toggle fw-bolder" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                    {{ activeCategory }}
                </h1>
                <ul class="dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                    <li v-for="(category, index) in userCategories" :value="category.Id" :key="category.Id" @click="onCategoryClick(index)">
                        <a class="dropdown-item">{{ category.Name }}</a>
                    </li>
                </ul>
            </div>

            <h1 class="fs-4 mt-2" data-bs-toggle="dropdown" aria-expanded="false"> 
                FILTER
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-filter" viewBox="0 0 16 16">
                <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
                </svg>
            </h1>
            <ul class="dropdown-menu">
                <li><a class="dropdown-item" :onClick="onByTeamClick">BY TEAM</a></li>
                <li><a class="dropdown-item" :onClick="onByTeamCategoryClick">BY TEAM CATEGORY</a></li>
                <li><a class="dropdown-item" :onClick="onByRoundClick">BY ROUND</a></li>
                <li><a class="dropdown-item" :onClick="onByCategoryClick">BY CHALLENGE CATEGORY</a></li>
                <li><a class="dropdown-item" :onClick="onBySubmissionsClick">BY SUBMISSIONS</a></li>
            </ul>
        
        </div>

        <ScoreboardComponent :activeTeams="activeTeams" :scoreboardType="activeScoreboardType" />

        <h1 class="fw-bolder mb-3 mt-3">TEAMS</h1>

        <div class="container-fluid table-responsive">
            <table class="table table-light table-striped mx-auto sortable" style="max-width: 80%">


                <thead>
                    <tr>
                        <th scope="col">Ranking</th>
                        <th scope="col">Team Name</th>
                        <th scope="col">Captain</th>
                        <th scope="col">Points</th>
                        <th scope="col"># Members</th>
                        <th scope="col">Category</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(activeTeam, index) in activeTeams" :key="activeTeam.Id">
                        <th scope="row">{{index + 1}}</th>
                        <td>{{activeTeam.Name}}</td>
                        <td>{{activeTeam.Captain}}</td>
                        <td>{{activeTeam.Points}}</td>
                        <td>{{activeTeam.MemberCount}}</td>
                        <td>{{activeTeam.Category}}</td>
                    </tr>
                </tbody>


            </table>
        </div>
    
    </div>
    <LoadingIcon v-if="!loaded"/>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeMount, computed } from 'vue';
import ScoreboardComponent from '@/components/ScoreboardComponent.vue';
import LoadingIcon from '@/components/LoadingIcon.vue';
import { TeamService } from '@/services/TeamService';
import { UserService } from '@/services/UserService';

import { useStore } from 'vuex';
import { State } from '@/store';
import { Socket } from 'engine.io-client';
import { SocketIOService } from '@/services/SocketIOService'

//TODO : Add proper functionality.

export default defineComponent ({
    components : {ScoreboardComponent, LoadingIcon},

    props : {},

    setup () {

        const teams = ref<any[]>([]); 
        const userCategories = ref<any[]>([]);
        const loaded = ref<boolean>(true);

        let activeCategory = ref();
        let activeCategoryIndex = 0;
        let activeScoreboardType = ref<string>('byTeamBoard');
        let activeTeams = ref<any[]>([]); 

        const store = useStore<State>();

        const initializeValues = async () => {
            // Get all teams and call user categories
            teams.value = (await TeamService.getAllTeams()).data.Teams;
            var all = {
                id: 0,
                Name: 'ALL',
                Level: '0',
                CreatedAt: 0
            }
            userCategories.value = [all];
            for(let userCategory of (await UserService.getUserCategory()).data.UserCategories)
                userCategories.value.push(userCategory);

            // Set default user category and filter teams by said user category
            activeCategory.value = userCategories.value[0].Name;
            activeCategoryIndex = 0;
            activeTeams.value = [];
            for(let team of teams.value){
                if(activeCategory.value == 'ALL'){
                    activeTeams.value.push(team);
                }
                else if(team.Category == activeCategory.value){
                    activeTeams.value.push(team);
                }
            }

            // Sort active teams
            activeTeams.value.sort(function(a, b){
                return b.Points - a.Points;
            })

            // TODO : SORT OPTIONS IN THE TABLE BELOW SCOREBOARD

            loaded.value = true;
        }

        (store.state.SocketIOService?.getSocket)?.on('refresh-chart', () => {
            initializeValues();
            console.log("Refresh chart received");
        })

        onBeforeMount(async () => {
            loaded.value = false;
            initializeValues();
        })

        // Category function

        const onCategoryClick = async (index : number) => {

            activeTeams.value = [];

            activeCategory.value = userCategories.value[index].Name;
            activeCategoryIndex = index;

            for(let team of teams.value){
                if(activeCategory.value == 'ALL'){
                    activeTeams.value.push(team);
                }
                else if(team.Category == activeCategory.value){
                    activeTeams.value.push(team);
                }
            }

        }   

        // Filter functions

        const onByTeamClick = async () => {

            activeScoreboardType.value = 'byTeamBoard';

        }   

        const onByTeamCategoryClick = async () => {

            activeScoreboardType.value = 'byTeamCategoryBoard';

        }   

        const onByRoundClick = async () => {

            activeScoreboardType.value = 'byRoundBoard';

        }   

        const onByCategoryClick = async () => {

            activeScoreboardType.value = 'byCategoryBoard';

        }   

        const onBySubmissionsClick = async () => {

            activeScoreboardType.value = 'bySubmissionsBoard';

        }   

        return { teams, userCategories, activeCategory, activeTeams, 
        onCategoryClick,
        onByTeamClick, onByTeamCategoryClick, onByRoundClick, onByCategoryClick, onBySubmissionsClick,
        initializeValues,
        loaded, activeScoreboardType
        
        }
    }

})
</script>

<style scoped lang="scss">

</style>