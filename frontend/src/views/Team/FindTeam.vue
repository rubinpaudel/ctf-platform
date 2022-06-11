<template>
    <div class="container-fluid pt-5 h-75 d-flex flex-column align-items-center justify-content-center">
        <h1 class="fw-bolder mb-4 mt-2">TEAMS</h1>


        <div class="input-group form-outline w-25 mb-4">
            <input type="text" class="form-control" placeholder="Search" v-model="search.FilterName">
            <div class="input-group-append">
                <span class="input-group-text" style="height:100%;" >
                    <BIconSearch></BIconSearch>
                </span>
            </div>
        </div>

        <div class="container w-25 mb-4">
            <div class="row">
                <div class="col">
                    <select class="form-select" v-model="search.FilterCategory" required>
                        <option value="" selected></option>
                        <option v-for="category in userCategories" :value="category.Name" :key="category.Id">
                                {{ category.Name }}
                        </option>
                    </select>
                </div>
                <div class="col">
                    <select class="form-select" v-model="search.SortBy" required>
                        <option value="name" selected>name</option>
                        <option value="points">points</option>
                    </select>
                </div>
                <div class="col">
                    <select class="form-select" v-model="search.SortDirection" required>
                        <option value="asc" selected>asc</option>
                        <option value="desc">desc</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="container-fluid table-responsive w-75" v-if="loaded">
            <table class="table table-dark table-striped mx-auto text-center">
                <thead>

                    <tr>
                        <th scope="col">Ranking</th>
                        <th scope="col">Team Name</th>
                        <th scope="col">Captain</th>
                        <th scope="col">Points</th>
                        <th scope="col">Members</th>
                        <th scope="col" v-if="!hasTeam"></th>
                        <th scope="col" v-if="isAdmin"></th>
                    </tr>
                    
                </thead>
                <tbody>

                    <tr v-for="(team, index) in teams" :key="team.Id">
                        <th scope="row">{{index + 1}}</th>
                        <td class="text-truncate">{{team.Name}}</td>
                        <td class="text-truncate">{{team.Captain}}</td>
                        <td class="text-truncate">{{team.Points}}</td>
                        <td>{{team.MemberCount}}</td>
                        <td v-if="!hasTeam">         
                            <button
                                type="button"
                                data-bs-toggle="modal" data-bs-target="#joinTeamDialog" 
                                :class="team.MemberCount < maxSize ? 'w-75 rounded-pill green-btn btn-success btn rounded-0 fw-bolder' : 'w-75 rounded-pill red-btn btn-danger btn rounded-0 fw-bolder'" 
                                @click="onShowTeamJoinModal(team.Id)"
                                :disabled="team.MemberCount >= maxSize"
                                >
                                {{team.MemberCount < maxSize ? 'JOIN' : 'FULL'}}
                            </button>
                        </td>
                        <td v-if="isAdmin">
                            <button
                                type="button"
                                data-bs-toggle="modal" data-bs-target="#DELETE" 
                                class="btn btn-danger w-75 bg-danger rounded-pill fw-bolder"
                                @click="deleteTeamId = team.Id"
                                > 
                                <BIconTrashFill/>
                            </button>
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>

                                
                                
        <LoadingIcon v-if="!loaded"/>
        <button class="btn fw-bolder mt-2 w-25 rounded-pill btn-lg border border-black rounded-0" @click="createTeam" v-if="loaded && !hasTeam && !isAdmin">CREATE YOUR OWN TEAM</button>

        <!-- Modal -->
        <div class="modal fade" id="joinTeamDialog" tabindex="-1" aria-labelledby="joinTeamDialog" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content bg-dark">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Join Team - {{joinTeam?.Name}}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    
                    <!-- Team Passcode -->
                    <div class="form-outline mb-4">
                        <label class="form-label">Team Passcode</label>
                        <input type="password" class="form-control" placeholder="●●●●●●●●" v-model="teamPassword"/>
                    </div>

                    <ButtonComponent :onClick="onJoinTeamClicked" class="w-100 mb-2" data-bs-dismiss="modal">
                        JOIN TEAM
                    </ButtonComponent>
                    <ButtonComponent class="w-100 mb-2" data-bs-dismiss="modal">
                        CANCEL
                    </ButtonComponent>
                </div>
                </div>
            </div>
        </div>
        <SureDialogComponent :onConfirmed="deleteTeam" Id="DELETE" Message="DELETE"/>
    </div>
    

</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, watch, computed } from 'vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import { useStore } from 'vuex';
import { State } from '@/store';
import { TeamService } from '@/services/TeamService';
import { UserService } from '@/services/UserService';
import { useToast } from 'vue-toastification';
import LoadingIcon from '@/components/LoadingIcon.vue';
import router from '@/router';
import { Search } from '@/types';
import {BIconSearch, BIconTrashFill} from 'bootstrap-icons-vue';
import SureDialogComponent from '@/components/SureDialogComponent.vue';

export default defineComponent ({
    components : {ButtonComponent, LoadingIcon, BIconSearch, BIconTrashFill, SureDialogComponent},
    setup () {
        const store = useStore<State>();
        const toast = useToast();

        const maxSize = ref(0);
        const hasTeam = ref();
        const teams = ref<any[]>([]);   
        const joinTeam = ref<any>(null);     
        const teamPassword = ref<string>('');
        const loaded = ref<boolean>(true);
        const search = ref<Search>({FilterName: "", FilterCategory: "", SortBy: "name", SortDirection: "asc"});
        const userCategories = ref<any[]>();
        const deleteTeamId = ref<number>(-1);

        onBeforeMount(async () => {
            try{
                loaded.value = false;
                teams.value = (await TeamService.getAllTeams()).data.Teams;
                userCategories.value = (await UserService.getUserCategory()).data.UserCategories;
                hasTeam.value = (await UserService.hasTeam()).data.hasTeam;
                maxSize.value = (await TeamService.getMaxTeamMembers()).data.TeamSize;
                loaded.value = true;
            } catch(e: any){
                loaded.value = false;
                toast.error("Error loading Teams.");
            }
        })
        const deleteTeam = async () => {
            try{
                // Get Teammatesids first for sockets.
                const ids = (await TeamService.getTeamMembers(deleteTeamId.value)).data;
                const response = (await TeamService.deleteTeam(deleteTeamId.value));
                toast.success(response.data.message);
                teams.value = teams.value.filter((team: any)=> team.Id !== deleteTeamId.value);
            
                (store.state.SocketIOService?.getSocket)?.emit('delete-team', {teamId: deleteTeamId.value, memberIds: ids.Team.Members.map((member:any)=> member.Id)});
            }catch(e:any){
                e.response.data.errors.forEach((e :any) => toast.error(e))
            }
        }
        const createTeam = () => {
            if(store.state.jwtPayload?.isAdmin){
                    toast.error("If you really want to, go to CREATE TEAM.");
            }
            else{
                router.push("/team/create");
            }
        }

        const onShowTeamJoinModal = (teamID : number) => {
            joinTeam.value = null;
            teams.value.forEach(t => {
                if (t.Id == teamID) joinTeam.value = t;
            });
        }
        
        const onJoinTeamClicked = async () => {
            try {
                if(store.state.jwtPayload?.isAdmin){
                    toast.error("Administrator accounts can't join teams!");
                }
                else{
                    const response = await TeamService.joinTeam(joinTeam.value.Id, teamPassword.value);
                    store.dispatch("HasTeam", true);
                    router.push("/team/overview");
                    toast.success(response.data.message);
                    (store.state.SocketIOService?.getSocket)?.emit('join-team', { teamId: joinTeam.value.Id, userId: store.state.jwtPayload?.UserID});
                    (store.state.SocketIOService?.getSocket)?.emit('send-refresh-chart', true); 
                }
            } catch (err : any) {
                console.log(err.response.data.errors)
                err.response.data.errors.forEach((e :any) => toast.error(e))
            }
        }
        const fetch = async() => {
            teams.value = (await TeamService.getAllTeamsBySearch(search.value)).data.Teams;
        }

        // When new teams comes in.
        (store.state.SocketIOService?.getSocket)?.on('new-team', async() => {
            teams.value = (await TeamService.getAllTeams()).data.Teams;
            hasTeam.value = (await UserService.hasTeam()).data.hasTeam;
        });

        // When new category
        (store.state.SocketIOService?.getSocket)?.on('new-usercategory', async() => {
            userCategories.value = (await UserService.getUserCategory()).data.UserCategories;
        });

        // When new teamsize
        (store.state.SocketIOService?.getSocket)?.on('new-teamsize', async() => {
            maxSize.value = (await TeamService.getMaxTeamMembers()).data.TeamSize;
        });


        watch(() => search.value.FilterName,  async() => { fetch();})
        watch(() => search.value.FilterCategory, async () => { fetch();})
        watch(() => search.value.SortBy, async () => { fetch();})
        watch(() => search.value.SortDirection, async () => { fetch();})

        return {
            loaded,
            maxSize,
            hasTeam,
            teams,
            joinTeam,
            teamPassword,
            onShowTeamJoinModal,
            onJoinTeamClicked,
            createTeam,
            search,
            userCategories,
            fetch,
            deleteTeam, 
            deleteTeamId,
            isAdmin : computed(() => store.state.loggedIn && store.state.jwtPayload?.isAdmin)

        }
    }

})
</script>

<style scoped lang="scss">
.green-btn {
    background-color: #6EF358 !important;
}
button  {
    background-color: white;
    color: #121212;
}
.table{
    table-layout: fixed;
}
</style>