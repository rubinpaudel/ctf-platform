<template>
    <div class="container-fluid h-100 pt-5 d-flex flex-column align-items-center justify-content-center">
        <div class="btn-group mt-3">
            <h1 class="dropdown-toggle fw-bolder" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                COMPETITION
            </h1>
            <ul class="dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                <li>
                    <router-link to="#" class="dropdown-item">Competition</router-link>
                </li>
                <li>
                     <router-link to="/admin/challenge-config" class="dropdown-item">Challenges</router-link>
                </li>
                <li>
                    <router-link to="/admin/team-config" class="dropdown-item">Teams</router-link>
                </li>
                <li>
                    <router-link to="/admin/points-config" class="dropdown-item">Points</router-link>
                </li>
                <li>
                    <router-link to="/admin/solves-config" class="dropdown-item">Solves</router-link>
                </li>
                <li>
                    <router-link to="/admin/purchases-config" class="dropdown-item">Purchases</router-link>
                </li>
            </ul>
        </div>

        <div class="w-50">
            <div class="mb-3">
                <label for="competitionName" class="form-label">Competition Name</label>
                <input type="text" class="form-control" id="competitionName" placeholder="name@example.com" v-model="competitionName">
            </div>

            <div class="mb-3">
                <label for="competitionStart" class="form-label">Competition Start</label>
                <input type="date" class="form-control" id="competitionStart" v-model="competitionStart">
            </div>

            <div class="mb-4">
                <label for="emailDomains" class="form-label">Add Domain</label>
                <div class="row">
                    <div class="input-group">
                            <input type="text" class="form-control" id="addCategory" placeholder="uhasselt.student.be" v-model="newDomain" @keypress.enter="onAddDomainClick">
                            <div class="input-group-append">
                            <BIconPlusSquare class="fs-1 mx-2 pointer" v-on:click="onAddDomainClick"></BIconPlusSquare>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <EmailCardComponent
                    v-for="(email, index) in allowedEmails"
                    :email="email"
                    :indexE="index"
                    :key="index"
                    @edit="onEditEmail"
                    @delete="onDeleteEmail"
                ></EmailCardComponent>
            </div>
            

            <ButtonComponent :onClick="onUpdateClicked" class="w-100 fw-bolder rounded-pill">
                UPDATE
            </ButtonComponent>
            <ButtonComponent :onClick="onWipeClicked" class="w-100 bg-danger mt-3 text-light border-0 fw-bolder rounded-pill">
                <BIconExclamationOctagon></BIconExclamationOctagon>
                RESET COMPETITION
            </ButtonComponent>

        </div>

    </div>
    
</template>

<script lang="ts">


import ButtonComponent from '@/components/ButtonComponent.vue';
import EmailCardComponent from '@/components/EmailCardComponent.vue';
import { defineComponent, onBeforeMount, ref } from 'vue';
import { useToast } from "vue-toastification";
import { CompetitionService } from '@/services/CompetitionService';

import { BIconExclamationOctagon, BIconPlusSquare} from 'bootstrap-icons-vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { State } from '@/store';

export default defineComponent({


    components: {ButtonComponent, BIconExclamationOctagon, EmailCardComponent, BIconPlusSquare},
    setup () {
        const store = useStore<State>();
        const router = useRouter();
        const toast = useToast();
        const competitionName = ref<string>("");
        const competitionStart = ref<Date>(new Date());
        const allowedEmails = ref<string[]>([]);
        const newDomain = ref<string>("");

        const onUpdateClicked = () => { 
            if(competitionName.value == ""){
                return toast.error("Competition name empty!");
            }
            CompetitionService.updateCompetitionName(competitionName.value)
                .then(res => { 
                    console.log(res.headers);
                    toast.success(res.data)
                })
                .catch(err => toast.error(err.response.data.errorMessage));
            CompetitionService.updateAllowedEmailDomains(allowedEmails.value.toString())
                .then(res => toast.success("Updated Domains"))
                .catch(err => toast.error(err.response.data.errorMessage));
            CompetitionService.updateCompetitionStartDate(competitionStart.value)
                .then(res => toast.success(res.data))
                .catch(err => toast.error(err.response.data.errorMessage));
            (store.state.SocketIOService?.getSocket)?.emit('new-time');
        }

        const onWipeClicked = async () => {
            
            console.log('WIPER')
         
            try {
                await CompetitionService.wipe();
                // Logout
                store.dispatch('LogOut')
                .then(() => router.push('/login'))
            } catch (error : any) {
                toast.error(error.response.data.errorMessage);
                
            }

        }

        const onDeleteEmail = (payload:any) => {
            allowedEmails.value.splice(payload.indexE, 1);
        }

        const onEditEmail = (payload: any) => {
            if(allowedEmails.value.find(email => payload.Email == email)){
                toast.error("Domain already in list.");
            }
            else{
                allowedEmails.value[payload.indexE] = payload.Email;
            }
        }

        const onAddDomainClick = () => {
            if(newDomain.value != ""){
                if(allowedEmails.value.find(email => newDomain.value == email)){
                    toast.error("Domain already in list.");
                }
                else{
                    allowedEmails.value.push(newDomain.value);
                    newDomain.value = "";
                }
            }
            else{
                toast.error("Empty!")
            }
        }

        onBeforeMount(async () => {

            competitionName.value = (await CompetitionService.getCompetitionName()).data.CompetitionName;
            allowedEmails.value = (await CompetitionService.getAllowedEmailDomains()).data.AllowedEmailDomains;
            competitionStart.value = (await CompetitionService.getCompetitionStartDate()).data.CompetitionStartDate;
            
        });

        (store.state.SocketIOService?.getSocket)?.on('new-challengecategory', async() => {
            competitionName.value = (await CompetitionService.getCompetitionName()).data.CompetitionName;
            allowedEmails.value = (await CompetitionService.getAllowedEmailDomains()).data.AllowedEmailDomains;
            competitionStart.value = (await CompetitionService.getCompetitionStartDate()).data.CompetitionStartDate;
        });

        return { competitionName,
                 competitionStart,
                 allowedEmails,
                 onUpdateClicked,
                 onWipeClicked,
                 onDeleteEmail,
                 onEditEmail, newDomain, onAddDomainClick
                 }
    }

});




</script>

<style lang="scss" scoped>
.dropdown-menu {
    text-align: center;
}
.pointer{
    cursor: pointer;
}
</style>