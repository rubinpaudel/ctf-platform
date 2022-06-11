<template>
    <!-- Modal -->
    <div class="modal fade h-100" id="createRound" tabindex="-1" aria-labelledby="createRound" aria-hidden="true">

        <div class="modal-dialog mw-100 d-flex justify-content-center align-items-center m-0 h-100 align-items-center">
            <div class="modal-content bg-dark d-flex align-items-center w-50">
                
                <div class="modal-body w-100">

                    <h1 class="fw-bolder my-4 text-center">CREATE ROUND</h1>
                    

                        <div class="mb-3">
                            <label for="roundName" class="form-label">Round Name</label>
                            <input type="text" class="form-control" id="roundName" placeholder="Epic Round Name" v-model="round.Name">
                        </div>

                        <div class="mb-3">
                            <label for="roundDescription" class="form-label">Round Description</label>
                            <textarea class="form-control" id="roundDescription" rows="3" placeholder="Round description..." v-model="round.Description"></textarea>
                        </div>

                        <div class="row mb-3">
                            <div class="col-6">
                                <label for="roundStart" class="form-label">Round start</label>
                                <input type="time" class="form-control" id="roundStart" v-model="round.StartTime">
                            </div>
                            <div class="col-6">
                                <label for="roundEnd" class="form-label">Round end </label>
                                <input type="time" class="form-control" id="roundEnd" v-model="round.EndTime">
                            </div>
                        </div>

                                    
                </div>

                <div class="modal-footer w-100 border-0">
                    <ButtonComponent class="w-100 mb-3" :onClick="onCreateRoundClicked" data-bs-dismiss="modal">CREATE ROUND</ButtonComponent>
                    <ButtonComponent class="w-100 bg-black text-white border border-0 mb-3" data-bs-dismiss="modal">CANCEL</ButtonComponent>
                </div>

            </div>
        </div>
    </div>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ButtonComponent from './ButtonComponent.vue';
import { Round } from '@/types';
import { useToast } from 'vue-toastification';
import { RoundService } from '@/services/RoundService';

import { useStore } from 'vuex';
import { State } from '@/store';
import { Socket } from 'engine.io-client';
import { SocketIOService } from '@/services/SocketIOService'

export default defineComponent({
    
    components : {ButtonComponent},

    setup (props, {emit}) {
        const toast = useToast();
        const round = ref<Round>({Id: 0,Name : '', Description: '', StartTime: '00:00', EndTime : '00:00'})

        const store = useStore<State>();

        const onCreateRoundClicked = async () => {
            if(round.value.Name == "") return toast.error("Round Name empty!");
            if(round.value.Description == "") return toast.error("Description empty");
            try {
                    const response = await RoundService.createRound(round.value);
                    toast.success(response.data.message);
                    emit('created-round', response.data.round);
                    round.value.Name= ""; round.value.Description= ''; round.value.StartTime='00:00'; round.value.EndTime = '00:00';

                    (store.state.SocketIOService?.getSocket)?.emit('new-round');
                    (store.state.SocketIOService?.getSocket)?.emit('send-refresh-chart', true);

            } catch (err : any) {
                toast.error(err.response.data.errorMessage);
                round.value.Name= ""; round.value.Description= ''; round.value.StartTime='00:00'; round.value.EndTime = '00:00';
            }
        
        }
        return { round, onCreateRoundClicked}
    }
})
</script>

<style scoped lang="scss">

</style>