<template>
    <div class="container-fluid h-100 d-flex flex-column align-items-center justify-content-center">
        <h1 class="fw-bolder mb-4 mt-3">CREATE TEAM</h1>
    
        <div class="w-25">
            <!-- Email -->
            <div class="form-outline mb-3">
                <label class="form-label">Team Name</label>
                <input type="text" class="form-control" placeholder="Name" v-model="newTeam.Name" />
            </div>

            
            <!-- Password -->
            <label class="form-label">Team Password</label>
            <div class="input-group form-outline mb-4">
                <input :type="showPassword ? 'text' : 'password'" class="form-control" placeholder="Password" @keypress.enter="onCreateTeamClick" v-model="newTeam.Password">
                <div class="input-group-append">
                    <span class="input-group-text" style="height:100%;" @click="showPassword = !showPassword">
                        <BIconEyeFill v-if="showPassword"></BIconEyeFill>
                        <BIconEyeSlashFill v-if="!showPassword"></BIconEyeSlashFill>
                    </span>
                </div>
            </div>

            <!-- Log in button -->
            <ButtonComponent :onClick="onCreateTeamClick" class="w-100 rounded-pill mb-1 fw-bolder">
                CREATE TEAM
            </ButtonComponent>


            
            <div class="mb-3 mt-2 d-flex justify-content-center">
                <router-link to='/team/find'>
                    <u class="fs-6">Do you want to join a team?</u>
                </router-link>
            </div>
            
        </div>
    </div>

</template>

<script lang="ts">
import ButtonComponent from '@/components/ButtonComponent.vue';
import { TeamService } from '@/services/TeamService';
import { NewTeam } from '@/types';
import { State } from '@/store';
import { useStore } from 'vuex';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { BIconEyeFill, BIconEyeSlashFill } from 'bootstrap-icons-vue';
    //TODO : Add proper functionality.

    export default defineComponent ({
        components : {ButtonComponent, BIconEyeFill, BIconEyeSlashFill},

        props : {},

        setup () {
            const showPassword = ref<boolean>(false);
            const store = useStore<State>();
            const router = useRouter();
            const toast = useToast();
            const newTeam = ref<NewTeam>({Name : '', Password : ''});

            const onCreateTeamClick = async () => {
                console.log(newTeam.value.Password, newTeam.value.Name);
                if(newTeam.value.Name == "") return toast.error("Name is empty! Fill in!");
                if(newTeam.value.Password == "") return toast.error("Password is empty! Fill in!");
                if(newTeam.value.Name.length > 30) return toast.error("Name too long init?");
                try {
                    const response = await TeamService.createTeam(newTeam.value)
                    toast.success(response.data.message);
                    store.dispatch("HasTeam", true);
                    router.push({name : 'team-overview'});

                    (store.state.SocketIOService?.getSocket)?.emit('create-team', store.state.jwtPayload?.UserID);
                    (store.state.SocketIOService?.getSocket)?.emit('send-refresh-chart', true); 
                } catch (err : any) {
                    toast.error(err.response.data.errorMessage);
                }

            }
            return {onCreateTeamClick, newTeam, showPassword}
        }

    })
</script>

<style scoped lang="scss">

a{
    text-decoration: none; 
    color: white;
}

</style>