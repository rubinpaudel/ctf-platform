<template>
    <div class="container-fluid h-100 d-flex flex-column align-items-center justify-content-center pt-5">
        <h1 class="fw-bolder mb-3 mt-4">Reset Password</h1>

        <div class="w-25" v-if="!isReset">
            <!-- Email -->
            <div class="form-outline mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" placeholder="serban-andrei.cojocaru@student.uhasselt.be" v-model="email" />
            </div>

            <ButtonComponent :onClick="onResetClick" class="w-100 my-1 fw-bolder rounded-pill">
                Reset password
            </ButtonComponent>

        </div>
        
        <div class="w-25" v-else>
            <!-- Password -->
            <label class="form-label">Password</label>
            <div class="input-group form-outline mb-3">
                <input :type="showPassword ? 'text' : 'password'" class="form-control" placeholder="Password" v-model="Password">
                <div class="input-group-append" v-if="Password.length > 0">
                    <span class="input-group-text" style="height:100%;" @click="showPassword = !showPassword">
                        <BIconEyeFill v-if="showPassword"></BIconEyeFill>
                        <BIconEyeSlashFill v-if="!showPassword"></BIconEyeSlashFill>
                    </span>
                </div>
            </div>

            <!-- Password Confirm -->
            <label class="form-label">Password Confirm</label>
            <div class="input-group form-outline mb-3">
                <input type="password" :class="passwordMatchClass" 
                placeholder="Password Confirm" v-model="PasswordConfirm">
            </div>

            <ButtonComponent :onClick="onChangePassword" class="w-100 my-1 fw-bolder rounded-pill">
                Reset password
            </ButtonComponent>

        </div>

    </div>

</template>

<script lang="ts">
import ButtonComponent from '@/components/ButtonComponent.vue';
import { defineComponent, onBeforeMount, ref } from 'vue';

import { useToast } from 'vue-toastification';
import { useRoute, useRouter } from 'vue-router';
import { AuthService } from '@/services/AuthService';

import { BIconEyeFill, BIconEyeSlashFill} from 'bootstrap-icons-vue';

export default defineComponent ({
    components : {ButtonComponent, BIconEyeFill, BIconEyeSlashFill},

    setup () {
        const toast = useToast();
        const route = useRoute();
        const router = useRouter()
        const email = ref<string>("");
        const isReset = ref<boolean>(false);
        const showPassword = ref<boolean>(false);
        const Password = ref<string>("");
        const PasswordConfirm = ref<string>("");

        const passwordMatch = ref<boolean>(false);
        const passwordMatchClass = ref("form-control");
        

        onBeforeMount(() => {
            if (route.params.code && route.params.code != '')
                isReset.value = true;
        })

        const checkPasswordMatch = () => {
            if(Password.value == PasswordConfirm.value)
            { 
                passwordMatch.value = true;
            }
            else{ 
                passwordMatch.value = false;
            }

            if(PasswordConfirm.value.length > 0) {
                if(passwordMatch.value){
                    passwordMatchClass.value = 'form-control is-valid';
                }
                else{
                    passwordMatchClass.value = 'form-control is-invalid';
                }  
            }
            else{
                passwordMatchClass.value = 'form-control';
            }
        }

        const onChangePassword = async () => {
            
            if (!isReset.value) return;

            if (Password.value == '') return toast.error('Password is required!');
            if (PasswordConfirm.value == '') return toast.error('Password Confirm is required!');

            if (PasswordConfirm.value != Password.value) return toast.error('Passwords need to match!');

            try {
                const response = (await AuthService.changePasswordWithCode(route.params.code as string, Password.value, PasswordConfirm.value));
                toast.success(response.data.message);
                router.push("/login")
            } catch (error : any) {
                toast.error(error.response.data.errorMessage);
            }

        }

        const onResetClick = async () => {
            
            try {
                const response = (await AuthService.resetPassword(email.value));
                toast.success(response.data.message);
            } catch (error : any) {
                toast.error(error.response.data.errorMessage);
            }

            return;
        }
        
        return {email, isReset, onResetClick, showPassword, Password, PasswordConfirm, passwordMatch, passwordMatchClass, checkPasswordMatch, onChangePassword}
    }

})
</script>

<style scoped lang="scss">

a{
    text-decoration: none; 
    color: white;
}

</style>