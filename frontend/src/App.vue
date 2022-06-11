<template>
    <div class="container-fluid min-vh-100 h-100 d-flex flex-column">
        <app-nav-bar-admin v-if="isAdmin" />
        <app-nav-bar-user v-else-if="isLoggedIn" />
        <app-nav-bar-login v-else />
        <router-view></router-view>
    </div>
</template>


<script lang="ts">
import NavbarAdmin from './components/Navbar/NavbarAdmin.vue'
import NavbarUser from './components/Navbar/NavbarUser.vue'
import NavbarLogin from './components/Navbar/NavbarLogin.vue'
import { defineComponent, computed, ref, watch, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { State } from './store';
import { SocketIOService, SocketConnectionType } from '@/services/SocketIOService'
import { useToast } from 'vue-toastification';
import { UserService } from '@/services/UserService';
/* eslint-disable */


export default defineComponent({
    components: {
        'app-nav-bar-admin' : NavbarAdmin, 
        'app-nav-bar-user' : NavbarUser, 
        'app-nav-bar-login' : NavbarLogin
    },
    setup() {
        const store = useStore<State>();
        const toast = useToast();
        const socket = ref<SocketIOService | null>(null);

        const SocketOnLoggedIn = () => {
            // Do all the socket connection things here

            if (socket.value != null) return;
            let connectionType : SocketConnectionType = 'user';
            
            if (store.state.jwtPayload?.isAdmin) connectionType = 'admin';

            socket.value = new SocketIOService(store.state.accessToken as string, connectionType);
            
            store.commit('setSocket', socket);

            socket.value.getSocket?.on('notification', ({title, message}) => {
                try {
                    const audio = new Audio(require('@/assets/notification-sound.mp3'));
                    audio.play();
                } catch (err) {return} 
                toast.info(`${title}\n${message}`, {timeout: false});
            })
        }

        if (store.state.loggedIn) SocketOnLoggedIn();

        onBeforeMount( async ()=> {
            //
        })
        // Watch Socket connection
        watch(() => store.state.loggedIn, (newVal, oldVal) => {
            
            // If user has logged off
            if (!newVal && oldVal) {store.state.SocketIOService?.closeConnection();socket.value=null}

            if (store.state.loggedIn) SocketOnLoggedIn();
            else if (socket.value != null) return
        })


        return {
            isLoggedIn: computed(() => store.state.loggedIn),
            isAdmin : computed(() => store.state.loggedIn && store.state.jwtPayload?.isAdmin)
        }
    },


});
</script>

<style lang="scss" scoped>
// Montserrat Font 
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap');


* {
    margin: 0;
    padding : 0;
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif;
}


.container-fluid {
    color : white;
    background-color: #121212;
}

</style>