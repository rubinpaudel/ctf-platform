<template>
    <div class="container-fluid pt-5 h-75 d-flex flex-column align-items-center justify-content-center">
        <h1 class="fw-bolder mb-4 mt-2">USERS</h1>
        
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

        <div class="container-fluid table-responsive w-50" v-if="loaded">
            <table class="table table-dark table-striped mx-auto text-center">
                <thead>

                    <tr>
                        <th scope="col">Number</th>
                        <th scope="col">Name</th>
                        <th scope="col">Category</th>
                        <th scope="col">Points</th>
                        <th scope="col" v-if="isAdmin"></th>
                    </tr>
                    
                </thead>
                <tbody>

                    <tr v-for="(user, index) in users" :key="user.Id">
                        <th scope="row">{{index + 1}}</th>
                        <td class="text-truncate">{{user.Name}}</td>
                        <td class="text-truncate">{{user.UserCategory}}</td>
                        <td class="text-truncate">{{user.Points}}</td>
                        <td v-if="isAdmin">         
                        <!-- Button to open modal -->
                            <button 
                            type="button"
                            data-bs-toggle="modal" data-bs-target="#DELETE" 
                            class="btn btn-danger w-75 bg-danger rounded-pill fw-bolder"
                            @click="deleteUserId = user.Id"
                            > 
                            <BIconTrashFill/>
                            </button>
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>
        <SureDialogComponent :onConfirmed="deleteUser"  Id="DELETE" Message="DELETE"/>
        <LoadingIcon v-if="!loaded"/>
    </div>
    

</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, watch, computed } from 'vue';
import { useStore } from 'vuex';
import { State } from '@/store';
import { UserService } from '@/services/UserService';
import { useToast } from 'vue-toastification';
import LoadingIcon from '@/components/LoadingIcon.vue';
import SureDialogComponent from '@/components/SureDialogComponent.vue';
import { Search } from '@/types';
import {BIconSearch, BIconTrashFill} from 'bootstrap-icons-vue';

export default defineComponent ({
    components : {LoadingIcon,BIconSearch,BIconTrashFill, SureDialogComponent},
    setup () {
        const store = useStore<State>();
        const toast = useToast();
        const hasTeam = ref();
        const users = ref<any[]>([]);   
        const loaded = ref<boolean>(true);
        const search = ref<Search>({FilterName: "", FilterCategory: "", SortBy: "name", SortDirection: "asc"});
        const userCategories = ref<any[]>();
        const deleteUserId = ref<number>(-1);

        onBeforeMount(async () => {
            try{
                loaded.value = false;
                users.value = (await UserService.getAllUsers(search.value)).data.data;
                userCategories.value = (await UserService.getUserCategory()).data.UserCategories;
                hasTeam.value = (await UserService.hasTeam()).data.hasTeam;
                loaded.value = true;
            } catch(e: any){
                loaded.value = false;
                toast.error("Error loading Teams.");
            }
        })

        const deleteUser = async() => {
            try{
                let user = users.value.filter((user)=> user.Id == deleteUserId.value);

                const response = (await UserService.deleteUser(deleteUserId.value));
                toast.success(response.data.message);
                users.value = users.value.filter((user: any)=> user.Id !== deleteUserId.value);
                
                let id = -1;
                if('TeamId' in user[0]){
                    id = user[0].TeamId;
                }
                (store.state.SocketIOService?.getSocket)?.emit('delete-user', {userId: deleteUserId.value, teamId: id});
                (store.state.SocketIOService?.getSocket)?.emit('new-team');
            }catch(e:any){
                e.response.data.errors.forEach((e :any) => toast.error(e))
            }
        }

        const fetch = async() =>{
            users.value = (await UserService.getAllUsers(search.value)).data.data;
        }

        // When new user comes in.
        (store.state.SocketIOService?.getSocket)?.on('new-user', async() => {
            loaded.value = false;
            users.value = (await UserService.getAllUsers(search.value)).data.data;
            hasTeam.value = (await UserService.hasTeam()).data.hasTeam;
            loaded.value = true;
        });

        // When teamchange is made
        (store.state.SocketIOService?.getSocket)?.on('new-team', async() => {
            loaded.value = false;
            users.value = (await UserService.getAllUsers(search.value)).data.data;
            hasTeam.value = (await UserService.hasTeam()).data.hasTeam;
            loaded.value = true;
        });

        // When new category
        (store.state.SocketIOService?.getSocket)?.on('new-usercategory', async() => {
            loaded.value = false;
            userCategories.value = (await UserService.getUserCategory()).data.UserCategories;
            loaded.value = true;
        });


        watch(() => search.value.FilterName,  async() => { fetch();})
        watch(() => search.value.FilterCategory, async () => { fetch();})
        watch(() => search.value.SortBy, async () => { fetch();})
        watch(() => search.value.SortDirection, async () => { fetch();})

        return {
            loaded,
            hasTeam,
            users, search,userCategories,
            fetch,
            deleteUserId,
            deleteUser,
            isAdmin : computed(() => store.state.loggedIn && store.state.jwtPayload?.isAdmin)
        }
    }

})
</script>

<style scoped lang="scss">
.green-btn {
    background-color: #6EF358 !important;
}
.pointer{
    cursor:pointer;
}
.table{
    table-layout: fixed;
}
button  {
    background-color: white;
    color: #121212;
}
</style>