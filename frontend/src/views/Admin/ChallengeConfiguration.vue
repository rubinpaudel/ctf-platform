<template>
    <div class="container-fluid pt-5 h-100 d-flex flex-column align-items-center justify-content-center">
        <div class="btn-group mt-3">
            <h1 class="dropdown-toggle fw-bolder" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                CHALLENGE CATEGORIES
            </h1>
            <ul class="dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                <li>
                    <router-link to="/admin/competition-config" class="dropdown-item">Competition</router-link>
                </li>
                <li>
                     <router-link to="#" class="dropdown-item">Categories</router-link>
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
                    <router-link to="/admin/purchases-config" class="dropdown-item">Purchases</router-link>
                </li>
            </ul>
        </div>

        <div class="w-50">
            <div class="mb-3">
                <label for="addCategory" class="form-label">New Category</label>
                <div class="input-group mb-3">  
                    <input type="text" class="form-control" id="addCategory" placeholder="Web Security" v-model="newCategory.Name" @keypress.enter="onAddCategoryClick">
                    <div class="input-group-append">
                        <BIconPlusSquare class="fs-1 mx-2 pointer" v-on:click="onAddCategoryClick"></BIconPlusSquare>
                    </div>
                </div>                
            </div>
        </div>

        <!-- Container with all Categories-->
        <div class="w-50">

            <CategoryCardComponent v-for="category in categories" 
            :category-name="category.Name"
            :category-i-d="category.Id" 
            :key="category.Id" 
            v-on:delete="onDeleteCategory"
            v-on:edit="onEditCategory"
            ></CategoryCardComponent>

        </div>

    </div>
</template>

<script lang="ts">

import { defineComponent, onBeforeMount, ref } from 'vue';

import CategoryCardComponent from '@/components/CategoryCardComponent.vue';
import {ChallengeCategory} from '@/types/'
import {BIconPlusSquare} from 'bootstrap-icons-vue'
import { ChallengeService } from '@/services/ChallengeService';
import { useToast } from 'vue-toastification';

import { useStore } from 'vuex';
import { State } from '@/store';
import { Socket } from 'engine.io-client';
import { SocketIOService } from '@/services/SocketIOService'


export default defineComponent({

    components : { CategoryCardComponent, BIconPlusSquare },
    setup() {
        const toast = useToast();
        const newCategory = ref<ChallengeCategory>({Name : ''});
        const categories = ref<any[]>([]);

        const store = useStore<State>();

        const onAddCategoryClick = async () => { 
            if(newCategory.value.Name == ""){return toast.error("Empty category!");}
            try {
                const response = await ChallengeService.createNewCategory(newCategory.value);
                toast.success(`Successfully created the ${response.data.Category.Name} category`);
                newCategory.value.Name = '';
                categories.value.push(response.data.Category);

                (store.state.SocketIOService?.getSocket)?.emit('new-challengecategory');
                (store.state.SocketIOService?.getSocket)?.emit('send-refresh-chart', true);

            } catch (err : any) {
                toast.error(err.response.data.errorMessage)
            }

        };


        const onDeleteCategory = async (payload : any) => {
            try {
                console.log(payload.id);
                const response = await ChallengeService.deleteCategory(payload.id);
                toast.success(`Successfully deleted the ${response.data.Category.Name} category`);


                categories.value = categories.value.filter((category) => {
                    return category.Id != payload.id
                });

                (store.state.SocketIOService?.getSocket)?.emit('new-challengecategory');
                (store.state.SocketIOService?.getSocket)?.emit('new-team');
                (store.state.SocketIOService?.getSocket)?.emit('new-image');
                (store.state.SocketIOService?.getSocket)?.emit('send-refresh-chart', true);

            } catch (err : any) { toast.error(err.response.data.errorMessage) }
        
        }

        const onEditCategory = async (payload : any) => {

            const {id, Name} = payload;
            try {
                const response = await ChallengeService.updateCategory(id, Name);
                toast.success(`Successfully updated the category to : ${response.data.Category.Name}`);
                categories.value.forEach((c) => {
                    if (c.Id == id)
                        c.Name = Name;
                });

                (store.state.SocketIOService?.getSocket)?.emit('new-challengecategory');
                (store.state.SocketIOService?.getSocket)?.emit('send-refresh-chart', true);

            } catch (err : any) {
                toast.error(err.response.data.errorMessage);
            }
        }

        (store.state.SocketIOService?.getSocket)?.on('new-challengecategory', async() => {
            categories.value = (await ChallengeService.getChallengeCategory()).data.ChallengeCategories;
        });

        onBeforeMount(async () => {
            categories.value = (await ChallengeService.getChallengeCategory()).data.ChallengeCategories;
        })

        return { newCategory, categories, onAddCategoryClick, onDeleteCategory, onEditCategory }

    },


});

</script>

<style scoped lang="scss">
.dropdown-menu {
    text-align: center;
}
.pointer{
    cursor:pointer;
}
</style>