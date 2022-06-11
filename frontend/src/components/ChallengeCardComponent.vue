<template>

    <div>

        <div class="card rounded-3 text-dark fw-bolder h-100" :class="{'solved-bg' : solved, 'pointer' : !solved}" 
            :data-bs-toggle="solved ? '':'modal'" 
            :data-bs-target="'#challengeModal'+$props.Challenge.challenge.Id"
            >
            <div class="card-body">
                <div class="w-100 h-100 d-flex flex-column align-items-center" v-if="Challenge.unlocked || solved">
                  <p>{{ Challenge.challenge.Name }}</p>
                  <p>{{ Challenge.challenge.Points + 'p' }}</p>   
                </div>
                <div class="w-100 h-100 d-flex flex-column align-items-center" v-else>
                    <BIconLock class="icon"></BIconLock>
                </div>
            </div>
        </div>
        <!-- Modal -->
        <div class="modal fade" v-if="Challenge.unlocked && challenge != null && Challenge.challenge.type != 'Quiz' " :id="'challengeModal'+$props.Challenge.challenge.Id" tabindex="-1" :aria-labelledby="'challengeModalLabel'+$props.Challenge.challenge.Id" aria-hidden="true">

            <div class="modal-dialog mw-100 d-flex justify-content-center">
                <div class="modal-content bg-dark text-white w-50">

                    <div class="modal-body">

                        <!-- Title -->
                        <h2 class="text-center my-2"> {{ Challenge.challenge.Name }} </h2>
                        <h2 class="text-center my-2 fs-3"> {{ Challenge.challenge.ChallengeCategory.Name }} </h2>
                        <h2 class="text-center my-2"> {{ Challenge.challenge.Points + 'p' }} </h2>

                        <section>
                            <h5 class="my-0 fw-bolder fs-6"> DESCRIPTION </h5>
                            <hr class="my-2 text-white">
                            <p>
                                {{challenge?.Description}}
                            </p>
                        </section>

                        <section class="mb-4" v-if="loaded && challenge.attachments?.length > 0">
                            <h5 class="my-0 fw-bolder fs-6"> Attachments </h5>
                            <hr class="my-2 text-white">
                            <div class="container-fluid px-0">
                                <div class="row px-1" v-for="attachment in challenge.attachments" :key="attachment.Id">
                                    <div class="col-10">
                                        {{attachment.FileName}}
                                    </div>
                                    <div class="col-2 text-end">
                                        <BIconDownload class="pointer" @click="downloadAttachment(attachment.Id)"></BIconDownload>
                                    </div>
                                </div>

                            </div>
                        </section>

                        <section class="mb-4" v-if="hints.length > 0">
                            <h5 class="my-0 fw-bolder fs-6"> HINTS </h5>
                            <hr class="my-2 text-white">
                            <HintComponent class="py-1" v-for="(hint, index) in hints" :key="hint.Id" :hint="hint.Hint" :Index="index">{{hint}}</HintComponent>
                        </section>

                        <section class="mb-4" v-if="challenge.type == 'Dockerized' && ports.length > 0">
                            <h5 class="my-0 fw-bolder fs-6"> Ports </h5>
                            <hr class="my-2 text-white">
                            <p> The following ports are opened by this challenge: </p>
                            <ul class="list-group">
                                <li class="list-group-item list-group-item-dark" v-for="port in ports" :key="port.DockerContainerPortID">
                                    {{port.PortMapping}}
                                </li>
                            </ul>
                        </section>

                        <section class="mb-4">
                            <h5 class="my-0 fw-bolder fs-6"> FLAG </h5>
                            <hr class="my-2 text-white">
                            <div class="container-fluid px-1 d-flex align-items-center justify-content-center w-100 mb-4">
                                <input type="text" :class="classFlag" placeholder="Flag!?" @keypress.enter="submitFlag(Challenge.challenge.Id)" v-model="flag" required>
                            </div>
                        </section>
                        
                        <ButtonComponent class="w-100 mb-3 fw-bolder" @click="submitFlag(Challenge.challenge.Id)">Submit Flag</ButtonComponent>
                        <ButtonComponent class="w-100 bg-black text-white border border-0 mb-3" id="Close" data-bs-dismiss="modal">Close</ButtonComponent>
                    </div>
                </div>
            </div>

        </div>

        <QuizComponent v-on:completed="CompleteChallenge" v-if="Challenge.unlocked && Challenge.challenge.type == 'Quiz' && challenge != null" :Challenge="challenge"></QuizComponent>

    </div>

</template>

<script lang="ts">
import { defineComponent, ref, onBeforeMount, watch } from 'vue'
import HintComponent from '@/components/HintComponent.vue';
import { HintService } from '@/services/HintService';
import {useToast} from 'vue-toastification';
import { BIconLock, BIconDownload } from 'bootstrap-icons-vue';
import { ChallengeService } from '@/services/ChallengeService';
import QuizComponent from './QuizComponent.vue';
import { useStore } from 'vuex';
import { State } from '@/store';
import ButtonComponent from './ButtonComponent.vue';
import { DockerService } from '@/services/DockerService';


export default defineComponent({
    components: {HintComponent, BIconLock, QuizComponent, BIconDownload, ButtonComponent},
    props: ["Challenge"],
    setup (props, {emit}) {

        const toast = useToast();
        const challenge = ref<any>(null);
        const hints = ref<any[]>([]);
        const loaded = ref<boolean>(true);
        const flag = ref<string>("");
        const classFlag = ref("form-control");
        const solved = ref<boolean>(false);
        const ports = ref<any[]>([]);
        const store = useStore<State>();

        onBeforeMount(async () => {

            solved.value = props.Challenge.solved;
            if (props.Challenge.unlocked) {
                loaded.value = false;

                try {
                     // Get The full challenge
                    challenge.value = (await ChallengeService.getChallengeById(props.Challenge.challenge.Id)).data.challenge;
                    // Get The challenges attachments
                    if (challenge.value.type != 'Dockerized')
                        challenge.value.attachments = (await ChallengeService.getChallengeAttachments(props.Challenge.challenge.Id)).data.attachments;

                    // Get The Ports
                    if (challenge.value.type == 'Dockerized') {
                        const allPorts = (await DockerService.getPortsByChallenge(challenge.value.Id)).data.ContainerPorts;
                        if (allPorts != null) ports.value = allPorts;
                    }

                    // GET HINTS
                    hints.value = (await HintService.filterByChallenge(props.Challenge.challenge.Id)).data.hints;

                } catch (error) {
                    console.log(error)
                }
               
                loaded.value = true;
            }

            
        })

        const downloadAttachment = async(id: number) => {
            const response = (await ChallengeService.getChallengeAttachmentById(id));
            console.log(response);
            var blob = new Blob([response.data], {type: response.headers['content-type']})
            var link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = (await ChallengeService.getAttachmentName(id)).data.Name;
            link.click()
        }

        const CompleteChallenge = () => {
            emit('completed');
        }
        
        const submitFlag = async(id :number) =>{
            if(flag.value != ""){
                try{
                    const response = (await ChallengeService.submitFlag(id, flag.value));
                    toast.success(response.data);
                    document.getElementsByClassName("modal-backdrop")?.item(0)?.remove() // PROBLEEM
                    document.getElementById("Close")?.click();
                    document.body.style.removeProperty("overflow");
                    document.body.style.removeProperty("padding-right");
                    document.getElementsByClassName("modal-backdrop")?.item(0)?.remove()
                    solved.value = true;

                    (store.state.SocketIOService?.getSocket)?.emit('new-solve');
                    (store.state.SocketIOService?.getSocket)?.emit('new-team');
                    (store.state.SocketIOService?.getSocket)?.emit('send-refresh-chart', true);
                }catch(e:any){
                    toast.error(e.response.data.errorMessage)
                }
            }
        } 
        const checkFlag = async() => {
            if(flag.value == ""){
                classFlag.value = "form-control is-invalid";
            }
            else{
                classFlag.value = "form-control";
            }
        }
        watch(() => flag.value, () => { checkFlag(); });


        return{hints, challenge, loaded, downloadAttachment, flag, submitFlag, classFlag, CompleteChallenge, solved, ports}

    }
})
</script>

<style scoped lang="scss">
.icon {
  font-size: 4em;
}
.pointer{
    cursor: pointer;
}
.modal{
    overflow-y:auto ;
}
.solved-bg {
    background-color: #68ED52;
}
</style>