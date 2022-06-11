<template>
    <div class="container-fluid pt-5 h-100 d-flex flex-column align-items-center justify-content-center">
        <div class="btn-group mt-3">
            <h1 class="dropdown-toggle fw-bolder" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                TEAMS
            </h1>
            <ul class="dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                <li>
                    <router-link to="/admin/competition-config" class="dropdown-item">Competition</router-link>
                </li>
                <li>
                     <router-link to="/admin/challenge-config" class="dropdown-item">Challenges</router-link>
                </li>
                <li>
                    <router-link to="#" class="dropdown-item">Teams</router-link>
                </li>
                <li>
                    <router-link to="/admin/points-config" class="dropdown-item">Points</router-link>
                </li>
                <li>
                    <router-link to="/admin/solves-config" class="dropdown-item">Solves</router-link>
                </li>
                <li>
                    <router-link to="/admin/purchases-config" class="dropdown-item">Purchases</router-link>
                </li>

            </ul>
        </div>

        <div class="w-50">
            <div class="mb-3">
                <label for="teamSize" class="form-label">Team size</label>
                <div class="input-group mb-3">
                    <input type="number" class="form-control" id="competitionName" placeholder="Enter the team size (e.g 4)" v-model="teamSize" @keypress.enter="onSaveClick">
                    <div class="input-group-append">
                        <BIconSave class="fs-1 mx-2 pointer" v-on:click="onSaveClick"></BIconSave>
                    </div>
                </div>
            </div>

            <div class="mb-3">
                <div class="row">
                    <label for="addCategory" class="form-label">Category name</label>
                    <div class="input-group">
                            <input type="text" class="form-control" id="addCategory" placeholder="UNIQUE NAME" v-model="newTeamCategory.Name" @keypress.enter="onAddCategoryClick">
                            <div class="input-group-append">
                            <BIconPlusSquare class="fs-1 mx-2 pointer" v-on:click="onAddCategoryClick"></BIconPlusSquare>
                        </div>
                    </div>
                </div>            
            </div>

            <div>
                <div class="d-flex flex-row align-items-center justify-content-between">
                    <span class="fs-5 fw-bolder my-1">Categories</span>
                    <BIconInfoCircle class="align-self-center ms-2 pointer" @mouseover="hover = true" @mouseleave="hover=false"></BIconInfoCircle>
                </div>
                <span class="mt-1" v-if="hover"><i>You can order categories by dragging and dropping!</i></span>
                <hr class="bg-light" />  
            </div>
        </div>

        <!-- Container with all Categories-->
        <div class="w-50">

        <draggable class="list-group"
            :list="teamCategories"
            item-key="Name"
            :disabled="editting"
            ghost-class="ghost"
            @end="onDrop"
            >
            <template #item="{ element }">
                <CategoryComponent 
                    :categoryName="element.Name" 
                    :category-i-d="element.Id"
                    :key="element.Level"
                    v-on:delete="onDeleteCategory"
                    v-on:edit="onEditCategory"
                    v-on:allowDragDrop="editting = !editting"
                />
            </template>
        </draggable>

        </div>
    </div>
    
</template>

<script lang="ts">

import { defineComponent, onBeforeMount, ref } from 'vue';


import {BIconSave, BIconPlusSquare, BIconInfoCircle} from 'bootstrap-icons-vue'
import { useToast } from "vue-toastification";
import { TeamService } from '@/services/TeamService';
import { UserCategory } from '@/types';
import { UserService } from '@/services/UserService';
import draggable from "vuedraggable";
import CategoryComponent from '@/components/CategoryComponent.vue';

import { useStore } from 'vuex';
import { State } from '@/store';
import { Socket } from 'engine.io-client';
import { SocketIOService } from '@/services/SocketIOService'

export default defineComponent({

    components : { CategoryComponent,BIconSave, BIconPlusSquare,BIconInfoCircle, draggable},
    setup() {

        const hover = ref<boolean>(false);
        const toast = useToast();
        // Data
        const teamCategories = ref<any[]>([]);
        const teamSize = ref<number>(0);
        const newTeamCategory = ref<UserCategory>({Name: '', Level: 0});
        const editting = ref<boolean>(false);

        const store = useStore<State>();

        onBeforeMount(async () => {
            teamSize.value = (await TeamService.getMaxTeamMembers()).data.TeamSize;
            teamCategories.value = (await UserService.getUserCategory()).data.UserCategories;
        });


        const onDrop = async () => {
            let updated = false;
            for (let [i, cat] of Object.entries(teamCategories.value)) {
                // If Cat not in order, update change on server
                let index = parseInt(i);
                if( cat.Level != index + 1){
                    cat.Level = index + 1;
                    try{
                        const response = await UserService.updateCategoryLevel(cat.Id, cat.Level);
                        updated = true;
                        (store.state.SocketIOService?.getSocket)?.emit('new-usercategory');
                        (store.state.SocketIOService?.getSocket)?.emit('send-refresh-chart', true);
                    } catch(e: any){
                        toast.error(e.response.data.errorMessage);
                    }
                    
                }
            }
            if(updated){
                toast.success("Updated Levels Correctly!");
            }
        };

        const onSaveClick = () => {
            
            TeamService.updateMaxTeamSize(teamSize.value)
            .then((response) => {
                toast.success(response.data);
                (store.state.SocketIOService?.getSocket)?.emit('new-teamsize');
            })
            .catch((err) => {
                toast.error(err.response.data.errorMessage);
            })
        };

        const onAddCategoryClick = async () => { 
            
            if (newTeamCategory.value.Name == '')
                return toast.error('Please create a valid team category');

            try {
                const response = await UserService.createCategory(newTeamCategory.value);
                toast.success(`Successfully created the ${response.data.Category.Name} category with level : ${response.data.Category.Level}`);
                newTeamCategory.value.Name = '';
                teamCategories.value.push(response.data.Category);

                (store.state.SocketIOService?.getSocket)?.emit('new-usercategory');
                (store.state.SocketIOService?.getSocket)?.emit('send-refresh-chart', true);
            } catch (err : any) {
                toast.error(err.response.data.errorMessage)
            }

        };


        
        const onEditCategory = async (payload : any) => {

            const {id, Name} = payload;
            try {
                const response = await UserService.updateCategoryName(id, Name);
                toast.success(`Successfully updated the category to : ${response.data.Category.Name}`);
                teamCategories.value.forEach((c) => {
                    if (c.Id == id)
                        c.Name = Name;
                });
                (store.state.SocketIOService?.getSocket)?.emit('new-usercategory');
                (store.state.SocketIOService?.getSocket)?.emit('send-refresh-chart', true);
            } catch (err : any) {
                toast.error(err.response.data.errorMessage);
            }
        }

        const onDeleteCategory = async (payload : any) => {
            try {
                const response = await UserService.deleteCategory(payload.id);
                toast.success(`Successfully deleted the ${response.data.Category.Name} category`);
                teamCategories.value = teamCategories.value.filter((category) => category.Id !== payload.id);

                (store.state.SocketIOService?.getSocket)?.emit('new-usercategory');
                (store.state.SocketIOService?.getSocket)?.emit('send-refresh-chart', true);
            } catch (err : any) { toast.error(err.response.data) }
        
        }

        (store.state.SocketIOService?.getSocket)?.on('new-usercategory', async() => {
            teamCategories.value = (await UserService.getUserCategory()).data.UserCategories;
        });

        (store.state.SocketIOService?.getSocket)?.on('new-teamsize', async() => {
            teamSize.value = (await TeamService.getMaxTeamMembers()).data.TeamSize;
        });


        return { teamCategories, 
                 teamSize,
                 newTeamCategory,
                 onSaveClick, 
                 onAddCategoryClick,
                 onDeleteCategory,
                 onEditCategory, onDrop, editting, hover
                 }

    },


});

</script>

<style scoped lang="scss">
.dropdown-menu {
    text-align: center;
}
.ghost {
  opacity: 1;
}
.pointer {
    cursor: pointer;
}
</style>