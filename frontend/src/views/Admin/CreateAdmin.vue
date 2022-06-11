<template>
    <div class="container-fluid h-100 d-flex flex-column align-items-center justify-content-center">
        <h1 class="fw-bolder mb-3 mt-4">CREATE ADMIN</h1>
    
        <div class="w-25" id="registrationForm">
            <!-- Full Name -->
            <label class="form-label">Nickname</label>
            <div class="input-group form-outline mb-3">
                <input type="text" :class="nameClass" placeholder="Admin1" v-model="register.Name" @keypress.enter="checkIfNameAvailable"/>
                <div class="input-group-append" v-if="register.Name.length > 0 && !searchedName">
                    <span class="input-group-text pointer" style="height:100%;" @click="checkIfNameAvailable">{{"Check&nbsp;"}}<BIconSearch/></span>
                </div>
            </div>

            <!-- Password -->
            <label class="form-label">Password</label>
            <div class="input-group form-outline mb-3">
                <input :type="showPassword ? 'text' : 'password'" class="form-control" placeholder="Password" v-model="register.Password">
                <div class="input-group-append" v-if="register.Password.length > 0">
                    <span class="input-group-text" style="height:100%;" @click="showPassword = !showPassword">
                        <BIconEyeFill v-if="showPassword" class="pointer"></BIconEyeFill>
                        <BIconEyeSlashFill v-if="!showPassword" class="pointer"></BIconEyeSlashFill>
                    </span>
                </div>
            </div>

            <!-- Password Confirm -->
            <label class="form-label">Password Confirm</label>
            <div class="input-group form-outline mb-3">
                <input type="password" :class="passwordMatchClass" 
                placeholder="Password Confirm" v-model="register.PasswordConfirm">
            </div>

            <!-- Category -->
            <div class="form-outline mb-3">
                <label class="form-label">Category</label>

                <select v-model="register.Category" class="form-select" required>
                    <option v-for="category in userCategories" :value="category.Id" :key="category.Id">
                        {{ category.Name }}
                    </option>
                </select>
            </div>

            <!-- Register button -->
            <ButtonComponent :onClick="onRegisterClick" class=" mt-2 w-100 mb-1 fw-bolder rounded-pill">
                CREATE
            </ButtonComponent>
        </div>
    </div>

</template>

<script lang="ts">
import ButtonComponent from '@/components/ButtonComponent.vue';
import { AuthService } from '@/services/AuthService';
import { UserService } from '@/services/UserService';
import {  RegisterAdmin } from '@/types';
import { AxiosError } from 'axios';
import { computed, defineComponent, onBeforeMount, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { BIconEyeFill, BIconEyeSlashFill, BIconSearch} from 'bootstrap-icons-vue';
import router from '@/router';


//TODO : Add proper functionality.
export default defineComponent ({
    components : {ButtonComponent, BIconEyeFill, BIconEyeSlashFill, BIconSearch},

    props : {},

    setup () {
        const passwordMatch = ref<boolean>(false);
        const passwordMatchClass = ref("form-control");
        const showPassword = ref<boolean>(false);
        const nameAvailable = ref<boolean>(false);
        const searchedName = ref<boolean>(false);
        const nameClass = ref("form-control");

        const toast = useToast();
        const register = ref<RegisterAdmin>({Name:"" ,Password: "", Category : null, PasswordConfirm: ""});
        const userCategories = ref<any[]>([]);


        onBeforeMount(async () => {
            userCategories.value = (await UserService.getUserCategory()).data.UserCategories;
        })
        const checkPasswordMatch = () => {
            if(register.value.Password == register.value.PasswordConfirm)
            { 
                passwordMatch.value = true;
            }
            else{ 
                passwordMatch.value = false;
            }

            if(register.value.PasswordConfirm.length > 0) {
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
        const checkIfNameAvailable = async () => {
            if(!searchedName.value){
                searchedName.value = true;
                if(register.value.Name.length > 0) {
                    const resp = (await UserService.nameAvailable(register.value.Name)).data.available;
                    nameAvailable.value = resp;
                    if(resp){
                        nameClass.value = 'form-control is-valid';
                    }
                    else{
                        nameClass.value = 'form-control is-invalid';
                    }  
                }
                else{
                    nameClass.value = 'form-control';
                }
            }
        }
        const onRegisterClick = () => {
            
            if (register.value.Name == "") return toast.error('Name is required!');
            if (register.value.Password == "") return toast.error('Password is required!');
            if (register.value.PasswordConfirm == "") return toast.error('PasswordConfirm is required!');
            if (register.value.Category == null) return toast.error('You must select a category!');

            AuthService.registerAdmin(register.value)
            .then((response) => {
                toast.success(response.data);
                router.push("/challenges");
            }).catch((err : AxiosError) => toast.error(err.response?.data.errorMessage))

        }
        watch(() => register.value.Password, () => { checkPasswordMatch();})
        watch(() => register.value.PasswordConfirm, () => { checkPasswordMatch(); })
        watch(() => register.value.Name, () => { nameClass.value = "form-control"; searchedName.value = false;})

        return {onRegisterClick, register, userCategories, showPassword, passwordMatch, passwordMatchClass, checkPasswordMatch, checkIfNameAvailable, searchedName, nameClass}
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