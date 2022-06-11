<template>
    <div class="header d-flex flex-row justify-content-between">
        <span class="fw-bolder align-self-center">
            {{round.Name}}
        </span>

        <div class="actions d-flex flex-row">
            <select class="form-select mx-2" v-model="cat" v-on:change="catChange">
                <option value="" selected></option>
                <option v-for="category in Categories" :value="category.Name" :key="category.Id">
                        {{ category.Name }}
                </option>
            </select>

            <router-link to="/admin/create-challenge" class="text-white mx-2 align-self-center">
                <BIconPlusCircle class="pointer fs-4"></BIconPlusCircle>
            </router-link>

            <BIconGear class="pointer align-self-center mx-2 fs-2" @click="editRound" data-bs-toggle="modal" data-bs-target="#editRound"></BIconGear>
            <BIconTrashFill class="pointer align-self-center mx-2 fs-2" @click="deleteRound" data-bs-toggle="modal" data-bs-target="#DELETEROUND"></BIconTrashFill>
        </div>

    </div>

    <hr class="bg-light my-2" />
    
    <div class="container-fluid p-0">
        <ul class="list-group p-0">
            <li class="list-group-item d-flex flex-row justify-content-between" v-for="(challenge, index) in round.Challenges" :key="challenge.Id">
                <span>{{challenge.Name}}</span>
                <div class="d-flex flex-row">
                    <!-- <BIconPencil class="mx-1 align-self-center pointer" @click="editChallenge(challenge.Id)" data-bs-toggle="modal" :data-bs-target="'#editChallenge'+challenge.Id"></BIconPencil> -->
                    <BIconPencil class="mx-1 align-self-center pointer" @click="editChallenge(challenge.Id, challenge.type)"></BIconPencil>
                    <BIconTrash2 class="mx-3 align-self-center pointer" @click="deleteChallenge(challenge.Id)" data-bs-toggle="modal" data-bs-target="#DELETECHALLENGE"></BIconTrash2>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="switch" v-model="switches[index]" @change="updateOnline(index, challenge.Id)" >
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">

import { defineComponent, ref, onBeforeMount } from 'vue';
import { BIconPlusCircle, BIconGear, BIconPencil, BIconTrash2, BIconTrashFill } from 'bootstrap-icons-vue';
import { RoundService } from '@/services/RoundService';
import { ChallengeService } from '@/services/ChallengeService';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { State } from '@/store';
import { useStore } from 'vuex';

export default defineComponent({
    components : { BIconPlusCircle, BIconGear, BIconPencil, BIconTrash2, BIconTrashFill},
    props: {
        Round: Object, Categories: Object,
    },
    emits: ["deleteChallenge", "editChallenge", "delete", "edit"],
    setup (props, {emit}) {

        const store = useStore<State>();
        const toast = useToast();
        const router = useRouter();
        const round = ref<any>(props.Round);
        const categories = ref<any>(props.Categories);
        const cat = ref<string>("");
        const switches = ref<boolean[]>([]);

        onBeforeMount( async () => {
            round.value.Challenges.forEach((challenge:any) => { switches.value.push(challenge.Status) });
            //console.log("round");
        })

        const deleteChallenge = async (id : number) => {
            emit("deleteChallenge", {id: id});
        }

        const editChallenge = async (id : number, type : string) => {
            if (type == 'Quiz')
                router.push({path: `/admin/create-quiz-challenge/${id}`});
            else if (type == 'Normal')
                router.push({path: `/admin/create-normal-challenge/${id}`});
            else if (type == 'Dockerized')
                router.push({path: `/admin/create-dockerized-challenge/${id}`});
            //emit("editChallenge", {id: id});
        }

        const deleteRound = async () => {
            emit('delete', { id : round.value.Id });
        }

        const editRound = async() => {
            emit("edit", {id: round.value.Id});
        }

        const catChange =async() => {
            round.value.Challenges = (await RoundService.filteredByCategory( round.value.Id, cat.value)).data.Challenges;
        }

        const onEditChallenge = (obj : any) => {
            console.log("Challenge edited.")
        }
        
        const updateOnline = async(index: number, challengeId: number)=>{
            try {
                const response = await ChallengeService.updateStatus(challengeId, switches.value[index]);
                toast.success(response.data.message);

                (store.state.SocketIOService?.getSocket)?.emit('new-round');
            } catch (err : any) {
                toast.error(err.response.data.errorMessage);
            }
        }

        return { round, categories, cat, catChange, editRound, editChallenge, onEditChallenge, deleteRound, deleteChallenge, props, updateOnline, switches}
    }
});




</script>

<style lang="scss" scoped>
.pointer {
    cursor: pointer;
}
</style>