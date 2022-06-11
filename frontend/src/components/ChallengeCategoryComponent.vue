<template>
    <div class="container d-flex flex-column py-3" v-if="challenges.length > 0">

        <div class="header d-flex flex-row justify-content-between">
            <span>{{ category.Name }}</span>
            <span>0/{{challenges.length}}</span>
        </div>

        <hr class="bg-light" />

        <div class="container-fluid">

            <div class="row w-100" :key="reload">
                <div class="col-3 mb-4" v-for="challenge in challenges" :key="challenge.Id">
                    <ChallengeCardComponent class="my-1 h-100" :Challenge="challenge" :id="challenge.challenge.Id" v-if="challenge.challenge.Status"
                        v-on:completed="onCompleteChallenge(challenge)">
                    </ChallengeCardComponent>
                    <div class="card rounded-3 text-dark fw-bolder offline my-1 h-100" v-else>
                        <div class="card-body">
                            <div class="w-100 h-100 d-flex flex-column align-items-center">
                                <p>OFFLINE</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    </div>

</template>

<script lang="ts">
import ChallengeCardComponent from '@/components/ChallengeCardComponent.vue'
import { ChallengeService } from '@/services/ChallengeService';
import { defineComponent, ref, onBeforeMount, watch } from 'vue'
import { useStore } from 'vuex';
import { State } from '@/store';

export default defineComponent({
    components : {ChallengeCardComponent},
    props: { category : Object, round : Number},
    setup (props, {emit}) {
        const store = useStore<State>();
        const challenges = ref<any[]>([]);
        const reload = ref<number>(0);

        const onCompleteChallenge = (challenge : any) => {
            challenge.solved = true;
        }
        watch(() => props.round, async(newVal, oldVal) => {

            if (oldVal != newVal)
                challenges.value = (await ChallengeService.getChallenges(newVal as number, props.category?.Id)).data.challenges;

        })

        onBeforeMount(async () => {
            challenges.value = (await ChallengeService.getChallenges(props.round as number, props.category?.Id)).data.challenges;
        });

        (store.state.SocketIOService?.getSocket)?.on('new-round', async() => {
            challenges.value = (await ChallengeService.getChallenges(props.round as number, props.category?.Id)).data.challenges;
        });

        (store.state.SocketIOService?.getSocket)?.on('new-solve', async() => {
            document.getElementsByClassName("modal-backdrop")?.item(0)?.remove() // PROBLEEM
            challenges.value = (await ChallengeService.getChallenges(props.round as number, props.category?.Id)).data.challenges;
            reload.value += 1;
        });

        return {challenges, onCompleteChallenge, reload}
    }
})
</script>

<style scoped lang="scss">
.offline {
    background-color: grey;
}

</style>