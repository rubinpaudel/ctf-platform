<template>
    <div class="container-fluid h-100 d-flex flex-column align-items-center justify-content-center">
        <h1 class="fw-bolder mb-3 mt-4">LOGIN</h1>
    
        <div class="w-25">
            <!-- Email -->
            <div class="form-outline mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" placeholder="serban-andrei.cojocaru@student.uhasselt.be" v-model="login.Email" />
            </div>

            <!-- Password -->
            <label class="form-label">Password</label>
            <div class="input-group form-outline">
                <input :type="showPassword ? 'text' : 'password'" class="form-control" placeholder="Password" @keypress.enter="onLoginClick" v-model="login.Password">
                <div class="input-group-append">
                    <span class="input-group-text" style="height:100%;" @click="showPassword = !showPassword">
                        <BIconEyeFill v-if="showPassword" class="pointer"></BIconEyeFill>
                        <BIconEyeSlashFill v-if="!showPassword" class="pointer"></BIconEyeSlashFill>
                    </span>
                </div>
            </div>

            <div class="row mb-4 mt-2">
                <router-link to="/reset-password" class="fs-6 text-end text-decoration-underline text-white">Forgot password?</router-link>
               
            </div>

            <!-- Log in button -->

            <ButtonComponent :onClick="onLoginClick" class="w-100 mb-1 fw-bolder rounded-pill">
                LOG IN
            </ButtonComponent>
            



            <div class="row mt-2">
                <router-link to='/register'>
                    <p class="fs-6 text-end"><u>Don't have an account yet?</u></p>
                </router-link>
            </div>
        </div>
    </div>

</template>

<script lang="ts">
import ButtonComponent from '@/components/ButtonComponent.vue';
import { defineComponent, ref } from 'vue';

import { useStore } from 'vuex';
import { State } from '@/store';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import { AxiosError } from 'axios';
import { Login  } from '@/types';
import { BIconEyeFill, BIconEyeSlashFill } from 'bootstrap-icons-vue';

//TODO : Add proper functionality.

export default defineComponent ({
    components : {ButtonComponent, BIconEyeFill, BIconEyeSlashFill},

    setup () {
        const showPassword = ref<boolean>(false);
        const store = useStore<State>();
        const toast = useToast();
        const router = useRouter();
        
        const login = ref<Login>({Email : "", Password : ""})

        const onLoginClick = async () => {
            if(login.value.Email == "") return toast.error("Email is empty!");
            if(login.value.Password == "") return toast.error("Password is empty!");

            store.dispatch('LogIn', login.value)
            .then(() => {
                if (store.state.loggedIn == true) {
                    router.push('/challenges');
                }
            }).catch((err : AxiosError) =>  {
                toast.error(store.state.logInError.errorMessage);
                
            })

        }
        
        return {login, onLoginClick, showPassword}
    }

})
</script>

<style scoped lang="scss">
a{
    text-decoration: none; 
    color: white;
}
.pointer {
    cursor: pointer;
}
</style>