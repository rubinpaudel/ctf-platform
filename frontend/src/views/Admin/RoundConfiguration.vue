<template>

    <div class="container-fluid pt-5 px-5 h-100 d-flex flex-column align-items-center justify-content-center">
        <h1 class="fw-bolder text-center w-100 mt-5 mb-5">
            ROUNDS
        </h1>
    
        <!-- Rounds Container  -->
        <div class="container-fluid d-flex flex-column w-50" :key="reload">

            <div class="container-fluid mb-4" v-for="round in Rounds" :key="round.Id">
                <RoundComponent 
                :Round="round" 
                :Categories="ChallengeCategories"
                v-on:delete="setRound"
                v-on:edit="setRound"
                v-on:editChallenge="setChallenge"
                v-on:deleteChallenge="setChallenge"
                />
            </div>
            <span class="align-self-end pointer my-3" data-bs-toggle="modal" data-bs-target="#createRound">Add round</span>

            <SureDialogComponent :onConfirmed="deleteRound"  Id="DELETEROUND" Message="DELETE"/>
            <SureDialogComponent :onConfirmed="deleteChallenge"  Id="DELETECHALLENGE" Message="DELETE"/>
            <CreateRoundDialogComponent v-on:created-round="addRound"></CreateRoundDialogComponent>
            <EditRoundDialogComponent :Round="currentRound" v-on:edited-round="onEditRound"></EditRoundDialogComponent>

        </div>
        
    </div>
    
</template>

<script lang="ts">

import { defineComponent, ref, onBeforeMount, watch } from 'vue';

import SureDialogComponent from '@/components/SureDialogComponent.vue';
import CreateRoundDialogComponent from '@/components/CreateRoundDialogComponent.vue';
import EditRoundDialogComponent from '@/components/EditRoundDialogComponent.vue';
import RoundComponent from '@/components/RoundComponent.vue';
import { RoundService } from '@/services/RoundService';
import { ChallengeService } from '@/services/ChallengeService';
import { useToast } from 'vue-toastification';

import { Challenge } from "@/types";

import { useStore } from 'vuex';
import { State } from '@/store';
import { Socket } from 'engine.io-client';
import { SocketIOService } from '@/services/SocketIOService'

export default defineComponent({
    components : {RoundComponent, EditRoundDialogComponent, 
        CreateRoundDialogComponent, 
            SureDialogComponent},
    setup () {
        const toast = useToast();
        const Rounds = ref<any[]>([]);
        const ChallengeCategories = ref<any[]>([]);
        const currentRound = ref<any>({Name : '', Description: '', StartTime: '00:00', EndTime : '00:00', Id: 0});
        const challengeId = ref<number>(0);
        const reload = ref<number>(0);
        const store = useStore<State>();

        onBeforeMount( async () => {
            ChallengeCategories.value = (await ChallengeService.getChallengeCategory()).data.ChallengeCategories;
            Rounds.value = (await RoundService.getRounds()).data.Rounds;
            console.log(Rounds.value);
        })

        const setRound = async (payload: any) => {
            Rounds.value.forEach((round:any) => 
            { 
                if(round.Id == payload.id) 
                {
                    currentRound.value.Name = round.Name;
                    currentRound.value.Description = round.Description;
                    if(round.StartTime.length > 6){
                        currentRound.value.StartTime = round.StartTime.split("T")[1].substring(0,5)
                    }
                    else{
                        currentRound.value.StartTime = round.StartTime
                    }
                    if(round.EndTime.length > 6){
                        currentRound.value.EndTime = round.EndTime.split("T")[1].substring(0,5)
                    }
                    else{
                        currentRound.value.EndTime = round.EndTime
                    }
                    currentRound.value.Id = round.Id;
                }
            })
        }

        const deleteRound = async () => {
            try{
                const response = await RoundService.deleteRound(currentRound.value.Id);
                toast.success(response.data.message);
                Rounds.value = Rounds.value.filter((round: any) => round.Id !== currentRound.value.Id);

                (store.state.SocketIOService?.getSocket)?.emit('new-round');
                (store.state.SocketIOService?.getSocket)?.emit('new-team');
                (store.state.SocketIOService?.getSocket)?.emit('new-image');
                (store.state.SocketIOService?.getSocket)?.emit('send-refresh-chart', true);
            }catch(err: any){
                toast.error(err.response.data.errorMessage)
            }
        }

        const deleteChallenge = async () => {
            try {
                const response = (await ChallengeService.deleteChallenge(challengeId.value));
                Rounds.value.forEach((round : any) => {
                    round.Challenges.forEach((challenge : any, index : number) => {
                        if (challenge.Id == challengeId.value)
                            round.Challenges.splice(index, 1);
                    })
                })
                toast.success(response.data.message);

                (store.state.SocketIOService?.getSocket)?.emit('new-team');
                (store.state.SocketIOService?.getSocket)?.emit('new-round');
                (store.state.SocketIOService?.getSocket)?.emit('new-image');
                (store.state.SocketIOService?.getSocket)?.emit('send-refresh-chart', true);
            } catch (err : any)  {
                toast.error(err.response.data.errorMessage);
            }

        }
        
        (store.state.SocketIOService?.getSocket)?.on('new-round', async() => {
            Rounds.value = (await RoundService.getRounds()).data.Rounds;
            reload.value++;
        });

        (store.state.SocketIOService?.getSocket)?.on('new-challengecategory', async() => {
            ChallengeCategories.value = (await ChallengeService.getChallengeCategory()).data.ChallengeCategories;
        });

        const addRound = async() => {
            Rounds.value = (await RoundService.getRounds()).data.Rounds;
            reload.value++;
        } 

        const onEditRound = async() => {
            Rounds.value = (await RoundService.getRounds()).data.Rounds;
            reload.value++;
        }

        const setChallenge = async (payload: any) =>{
            challengeId.value = payload.id;
        }

        return {currentRound, setChallenge, Rounds, ChallengeCategories,deleteRound, addRound, deleteChallenge, onEditRound, setRound, reload}
    }
});




</script>

<style lang="scss" scoped>
.pointer {
    cursor: pointer;
}
</style>