<template>
    <div class="container-fluid pt-5 h-75 d-flex flex-column align-items-center justify-content-center">
        <h1 class="fw-bolder mb-3">ALERT</h1>
    
        <div class="w-25">
            <!-- Email -->
            <div class="form-outline mb-3">
                <label class="form-label">Alert Title</label>
                <input type="text" class="form-control" placeholder="Some alert title" v-model="alert.title" />
            </div>

            <!-- Password -->
            <div class="form-outline mb-3">
                <label class="form-label">Alert Description</label>
                <textarea rows="4" class="form-control" style="resize:none" placeholder="Enter a description" v-model="alert.message" />
            </div>

            <!-- Log in button -->
            <ButtonComponent :onClick="onSendAlertClick" class="w-100 mb-1 rounded-pill fw-bolder">
                SEND ALERT
            </ButtonComponent>
        </div>
    </div>

</template>

<script lang="ts">
import ButtonComponent from '@/components/ButtonComponent.vue';
import { defineComponent, ref } from 'vue';
import { Alert } from '@/types/'
import { useStore } from 'vuex';
import { State } from '@/store';
import { Socket } from 'engine.io-client';
import {useToast} from 'vue-toastification'
//TODO : Add proper functionality.

export default defineComponent ({
    components : {ButtonComponent},

    props : {},

    setup () {
        const store = useStore<State>();
        const alert = ref<Alert>({title : '', message : ''})
        const toast = useToast();

        const onSendAlertClick = () => {
            
            if (alert.value.title == '' || alert.value.message == '') return toast.error("Title and Description required!");

            (store.state.SocketIOService?.getSocket)?.emit('send-notification', alert.value);
            toast.success("Notification sent!");
            alert.value = {message : '', title : ''};
            
        }
        return {onSendAlertClick, alert}
    }

})
</script>

<style scoped lang="scss">

</style>