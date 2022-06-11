<template>
    <div v-if="isLoading" class="container-fluid d-flex flex-column justify-content-center align-items-center col">
        <div class="spinner-border" role="status">
        </div>
        <span class="mt-2">Creating Challenge ...</span>
    </div>
    <div v-else class="container-fluid h-100 d-flex flex-column align-items-center justify-content-center pt-5">
        <h1 v-if="newChallenge.Name == '' || newChallenge.Name == undefined"> Normal Challenge </h1>
        <h1 v-else> {{newChallenge.Name}} </h1>
        <section class="w-50" v-if="currentStep==1">

            <div class="mb-3">
                <label for="cn" class="form-label">Name</label>
                <input type="text" class="form-control" id="cn" placeholder="Challenge Name" v-model="newChallenge.Name" required>
            </div>

            <div class="mb-3">
                <label for="cc" class="form-label">Category</label>

                <select v-model="newChallenge.ChallengeCategoryID" class="form-select" required id="cc">
                    <option v-for="category in Categories" :value="category.Id" :key="category.Id">
                        {{ category.Name }}
                    </option>
                </select>


            </div>

            <div class="mb-3">
                <label for="cr" class="form-label">Round</label>
                <select v-model="newChallenge.RoundID" class="form-select" required id="cr">
                    <option v-for="round in Rounds" :value="round.Id" :key="round.Id">
                        {{ round.Name }}
                    </option>
                </select>

            </div>

            <div class="mb-3">
                <label for="crc" class="form-label">Required Challenge</label>

                <select v-model="newChallenge.RequiredChallengeID" class="form-select" id="crc" multiple>
                    <option v-for="challenge in Challenges" :value="challenge.Id" :key="challenge.Id" :selected="newChallenge.RequiredChallengeID?.includes(challenge.Id)">
                        {{ challenge.Name }}
                    </option>
                </select>

            </div>
            
            <div class="mb-3">
                <label for="cd" class="form-label">Description </label>
                <textarea  class="form-control" id="cd" rows="3" v-model="newChallenge.Description" required></textarea>
            </div>

        </section>

        <section class="w-50" v-else-if="currentStep == 2">


            
            <div class="mb-3">
                <label for="cf" class="form-label">Flag</label>
                <input type="text" class="form-control" id="cf" placeholder="UHCTF{SOME_FLAG}" v-model="newChallenge.Flags[0]" required>
            </div>

            <div class="mb-3">
                <label for="cp" class="form-label">Points</label>
                <input type="Number" class="form-control" id="cp" placeholder="15" min="0" v-model="newChallenge.Points" required>
            </div>

            <div class="mb-3">
                <label for="ca" class="form-label">Add your Attachments</label>
                <input class="form-control" multiple type="file" id="ca" @change="onFileUpload($event)" >
            </div>
            
            <div class="mb-3">

                <div class="card my-3 text-dark fw-bolder" v-for="(attachment, index) in attachments" :key="index">
                    <div class="card-body d-flex flex-row justify-content-between">
                        <span>
                            {{ attachment.type == 'Old' ? attachment.item.FileName : attachment.item.name }}
                        </span>


                        <div class="actions">
                            <BIconTrash class="mx-1 pointer" v-on:click="onDeleteAttachment(index)"></BIconTrash>
                        </div>
                    </div>
                </div>

            </div>
        

        </section>

        <section v-else class="w-50 h-100">

            <div class="w-100 py-3 px-2 h-100">

            <div 
                class="container-fluid bg-dark text-white shadow shadow-lg py-4 px-2 d-flex flex-row text-dark h-100 rounded my-4"
                v-for="(hint, index) in Hints"
                :key="index"
            >
        
                <div class="d-flex flex-column px-2 mt-3">

                    <BIconArrowUp class="pointer mb-2" @click="onMoveUp(index)"></BIconArrowUp>
                    <BIconArrowDown class="pointer" @click="onMoveDown(index)"></BIconArrowDown>

                </div>

                <div class="container-fluid">

                    <div class="d-flex flex-row justify-content-between">
                        <h3 class="fw-bolder fs-6">Hint {{hint.Order + 1}}</h3>
                    </div>

                    <div class="my-3">

                        <div class="row">
                            <div class="col-6">
                                <select v-model="hint.PointsType" class="form-select" id="hpt">
                                    <option value="Percentage">Percentage</option>
                                    <option value="Normal">Normal</option>
                                </select>
                            </div>
                            <div class="col-6">
                                <input type="number" class="form-control" v-model="hint.PointsValue" placeholder="15" required>
                            </div>
                        </div>
                    </div>

                    <span class="fw-bolder fs-6">Hint</span>

                    <div class="my-3">
                        <textarea class="form-control" v-model="hint.Hint" required placeholder="Create some hint ..."></textarea>
                    </div>

                    <p class="text-danger pointer text-end p-0 m-0 fs-small" @click="onDeleteHint(index)">Delete Hint</p>

                </div>
                
            </div>
            <p class="pointer text-end p-0 m-0 text-underline" @click="onAddHint">Click here to add a hint</p>
        </div>

        </section>

        <ButtonComponent :onClick="onNextStep" v-if="currentStep != maxSteps" class="my-1">Next</ButtonComponent>
        <ButtonComponent :onClick="onPreviousStep" v-if="currentStep != 0" class="my-1">Previous</ButtonComponent>
        <ButtonComponent :onClick="onCreateChallenge" v-if="currentStep == maxSteps" class="my-1">
                {{ isEditChallenge? 'Edit Challenge' : 'Create Challenge' }}
        </ButtonComponent>
    
    </div>

</template>

<script lang="ts">
import ButtonComponent from '@/components/ButtonComponent.vue';
import { BIconArrowUp, BIconArrowDown, BIconTrash } from 'bootstrap-icons-vue';
import { defineComponent, isRef, onBeforeMount, reactive, ref, toRef } from 'vue';
import { useToast } from 'vue-toastification';
import { ChallengeService } from '../../../services/ChallengeService';
import { RoundService } from '../../../services/RoundService';
import {Challenge, Hint} from '../../../types/'
import { useStore } from 'vuex';
import { State } from '@/store';
import { useRoute, useRouter } from 'vue-router';
import { HintService } from '@/services/HintService';

export default defineComponent ({
    components : { ButtonComponent, BIconArrowUp, BIconArrowDown, BIconTrash },
    setup () {
        const route = useRoute();
        const toast = useToast();
        const router = useRouter();
        const store = useStore<State>();
        const isLoading = ref<boolean>(false);
        const maxSteps = 3;
        const currentStep = ref<number>(1);
        const Categories = ref<any[]>([]);
        const Rounds = ref<any[]>([])
        const Challenges = ref<any[]>([]);
        const newChallenge = ref<Challenge["Challenge"]>({Flags: [], Name: '', RoundID: 0, ChallengeCategoryID: 0, Description: '', Points: 0, RequiredChallengeID : []});
        const attachments = ref<any[]>([]);

        const isEditChallenge = ref<boolean>(false);
        const Hints = reactive<any[]>([]);

        onBeforeMount(async () => {
            if (route.params.id && route.params.id != "") {
                // We need to edit the Quiz Challenge
                isEditChallenge.value = true;

                // Get The Challenge Info
                try {
                    
                    const data = (await ChallengeService.getChallengeById(parseInt(route.params.id as string))).data.challenge;
                    // Get The Flags
                    newChallenge.value = {
                            Name: data.Name, 
                            Description: data.Description, 
                            RoundID: data.Round.Id, 
                            ChallengeCategoryID: data.ChallengeCategory.Id,
                            Points : data.Points,
                            Flags: (await ChallengeService.getFlags(parseInt(route.params.id as string))).data.Flags,
                            RequiredChallengeID: [],
                            Hints: []
                        }
                    data.RequiredChallenges.forEach((c : any) => newChallenge.value.RequiredChallengeID?.push(c.Id))
                    // get the attachments 
                    const a = (await ChallengeService.getChallengeAttachments(parseInt(route.params.id as string))).data.attachments;
                    a.forEach((at : any) => {
                        attachments.value.push({type: 'Old', item: at})
                    });
                    // Get The Hints

                    const ch = (await HintService.getAdminHints(parseInt(route.params.id as string))).data.Hints;
                    ch.forEach((h : any) => {
                        let newHint : Hint;
                        if (h.Points != null) newHint = {Order : h.Order, Hint : h.Description, PointsType: 'Normal', PointsValue: h.Points};
                        else newHint = {Order : h.Order, Hint : h.Description, PointsType: 'Percentage', PointsValue: h.PointsPercentage};

                        Hints.push(newHint)
                    })
                } catch (error : any) {
                    toast.error(error.response.data.errorMessage);
                }

            }
            Categories.value = (await ChallengeService.getChallengeCategory()).data.ChallengeCategories;
            Challenges.value = (await ChallengeService.listChallenges()).data.Challenges;
            Rounds.value = (await RoundService.getRounds()).data.Rounds
        })


        const onFileUpload = (event : any) => {
            Array.from(event.target.files).forEach((i : any) => attachments.value.push({type: 'New', item: i}));
        }


        const onNextStep = () => currentStep.value = (currentStep.value + 1) % (maxSteps+1); 
        const onPreviousStep = () => {
            if (currentStep.value == 0) return
            currentStep.value = currentStep.value - 1; 
        }

        const onCreateChallenge = async () => {
            try {

                isLoading.value = true;

                const nc : Challenge = {ChallengeType : "Normal", Challenge: newChallenge.value};
                nc.Challenge.Hints = Hints;

                const a : any[] = [];
                attachments.value.forEach((at : any) => {
                    if (at.type == 'New') a.push(at.item);
                });


                let response;
                 if (!isEditChallenge.value) {
                    response = await ChallengeService.createChallenge(nc, a);
                } else {
                    response = await ChallengeService.editChallenge(nc, parseInt(route.params.id as string));
                    await ChallengeService.addAttachments(parseInt(route.params.id as string), a);
                }
                toast.success(response.data.message);
                router.push("/admin/round-config");
                (store.state.SocketIOService?.getSocket)?.emit('new-round');

            } catch (error : any) {
                toast.error(error.response.data.errorMessage);
            }
            isLoading.value = false;
        }

        const onAddHint = () => {
            const newHint : Hint = {Order : Hints.length, PointsType: 'Percentage', PointsValue : 0, Hint: ""}; 
            Hints.push(newHint);
        }

        const onDeleteHint = (index : number) => { 
            Hints.splice(index,1);
            Hints.forEach((item : Hint, index : number) => item.Order = index);  // Update Order
        }

        const onMoveUp = (index : number) => {
            if (index == 0) return
            [Hints[index - 1], Hints[index]] =  [Hints[index], Hints[index - 1]];
        }

        const onMoveDown = (index : number) => {
            if (index == Hints.length - 1) return
            [Hints[index + 1], Hints[index]] =  [Hints[index], Hints[index + 1]];
        }

        const onDeleteAttachment = async (index : number) => {
            if (attachments.value[index].type == 'Old') {
                // Delete Attachment
                try {
                    await ChallengeService.deleteAttachment(attachments.value[index].item.Id);
                    attachments.value.splice(index, 1);                    
                    toast.success('Removed attachment!');
                } catch (error : any) {
                    toast.error(error.response.data.errorMessage);
                }
            } else {
                attachments.value.splice(index, 1);
                toast.success('Removed attachment!');
            }
        }

        return {

            currentStep,
            Categories,
            Hints,
            Rounds,
            Challenges,
            newChallenge,
            maxSteps,
            attachments,
            isEditChallenge,
            onNextStep,
            onPreviousStep,
            onFileUpload,
            onCreateChallenge,
            onDeleteAttachment,
            onAddHint,
            isLoading,
            onDeleteHint,
            onMoveUp,
            onMoveDown
        }
    }

})
</script>

<style scoped lang="scss">
.pointer {
    cursor: pointer;
}

</style>