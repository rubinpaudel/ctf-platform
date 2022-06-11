<template>
    <!-- Modal -->
    <div class="modal fade h-100" :id="'editChallenge'+challengeModalId" tabindex="-1" aria-labelledby='editChallenge' aria-hidden="true">

        <div class="modal-dialog mw-100 d-flex justify-content-center align-items-center m-0 h-100 align-items-center">
            <div class="modal-content bg-dark text-light d-flex align-items-center w-50">
                
                <div class="modal-body w-100">

                    <h1 class="fw-bolder my-4 text-center">EDIT CHALLENGE</h1>
                    
                    <div class="container">
                    
                        <div class="mb-3">
                            <label :for="'challengeName'+challengeModalId" class="form-label">Challenge Name</label>
                            <input type="text" class="form-control" :id="'challengeName'+challengeModalId" placeholder="Epic Challenge Name" v-model="challenge.Name">
                        </div>

                        <div class="mb-3">
                            <label :for="'challengeDescription'+challengeModalId" class="form-label">Challenge Description</label>
                            <textarea class="form-control" :id="'challengeDescription'+challengeModalId" rows="3" placeholder="Challenge description..." v-model="challenge.Description"></textarea>
                        </div>

                        <div class="mb-3">
                            <label :for="'challengePoints'+challengeModalId" class="form-label">Challenge Points</label>
                            <input type="number" class="form-control" :id="'challengePoints'+challengeModalId" placeholder="50" v-model="challenge.Points">
                        </div>

                    </div>
                                    
                </div>

                <div class="modal-footer border-0 w-100">
                    <ButtonComponent class="w-100 mb-3" :onClick="onEditChallengeClicked" data-bs-dismiss="modal">EDIT CHALLENGE</ButtonComponent>
                    <ButtonComponent class="w-100 bg-black text-white border border-0 mb-3" data-bs-dismiss="modal">CANCEL</ButtonComponent>

                </div>

            </div>
        </div>
    </div>

</template>

<script lang="ts">
import { ChallengeService } from '@/services/ChallengeService';
import { defineComponent, ref, watch, onBeforeMount, onUpdated } from 'vue'
import { useToast } from 'vue-toastification';
import ButtonComponent from './ButtonComponent.vue';

import { useStore } from 'vuex';
import { State } from '@/store';
import { Socket } from 'engine.io-client';
import { SocketIOService } from '@/services/SocketIOService'

export default defineComponent({
    
    components : {ButtonComponent},
    props : {Challenge : Object},
    setup (props, {emit}) {

        const toast = useToast();
        const challenge = ref<any>(props.Challenge);
        let challengeModalId = ref(challenge.value.Id);

        const store = useStore<State>();

        const onEditChallengeClicked = async () => { 

            try {
                let challengeAttachments = (await ChallengeService.getChallengeAttachments(challenge.value.Id)).data.attachments;
                console.log(challenge);
                const response = (await ChallengeService.editChallenge(challenge.value.type, challenge.value));
                toast.success("You did it, yay!");
                emit('edited-challenge', {challenge: challenge.value});

                (store.state.SocketIOService?.getSocket)?.emit('send-refresh-chart', true);
            } catch (err : any) {
                toast.error("Try again.");
            }

         }

        return {challenge, challengeModalId, onEditChallengeClicked}
    }
})
</script>

<style scoped lang="scss">

</style>