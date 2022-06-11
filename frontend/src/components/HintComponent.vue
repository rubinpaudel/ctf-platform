<template>
    <div>
        <div class="accordion" :id="'#hintAcc'+hintModalId">
            <div class="accordion-item">
                <h2 class="accordion-header" :id="'#hintAccHeader'+hintModalId">
                    <button type="button" :class="boughtHint ? 'btn-success' : 'btn-secondary'" class="w-100 btn btn-lg border border-black rounded-0 fw-bolder" data-bs-toggle="collapse" :data-bs-target="'#hintAccCollapse'+hintModalId" aria-expanded="true" :aria-controls="'#hintAccCollapse'+hintModalId">
                        HINT {{Index + 1}} ({{hint.Text}})
                    </button>
                </h2>
                <div :id="'hintAccCollapse'+hintModalId" class="accordion-collapse collapse" :aria-labelledby="'#hintAccHeader'+hintModalId" :data-bs-parent="'#hintAcc'+hintModalId">
                    <div class="accordion-body">
                        <div class="text-center">
                            <button type="button" @click="buyHint" :class="boughtHint ? 'invisible' : 'visible'" :style="[boughtHint ? 'width: 0px;' : '', boughtHint ? 'height: 0px;' : '']" class="w-50 rounded-pill btn-secondary btn btn-lg border border-black rounded-0">Purchase Hint?</button>
                        </div>
                        <p style="color: black">{{hintDesc}}</p>    
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>


<script lang="ts">
import { defineComponent, ref, onBeforeMount } from 'vue'
import { HintService } from '@/services/HintService';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';
import { State } from '@/store';
import { Socket } from 'engine.io-client';
import { SocketIOService } from '@/services/SocketIOService'

export default defineComponent({
    props: ["hint", "Index"],
    setup (props) {

        const toast = useToast();
        const hintModalId = ref(props.hint.Id);
        const hintDesc = ref();
        const boughtHint = ref(false);

        const store = useStore<State>();

        onBeforeMount(async () => {
            const response = (await HintService.isBought(props.hint.Id)).data;
            boughtHint.value = response.isBought;
            if(response.isBought){
                hintDesc.value = response.Description; 
            }
        })

        const buyHint = async () => {
            try{
                const response = (await HintService.buy(props.hint.Id));
                toast.success("Bought hint!");
                boughtHint.value = true;
                hintDesc.value = response.data.Description;

                (store.state.SocketIOService?.getSocket)?.emit('new-purchase', response.data.TeamId);
                (store.state.SocketIOService?.getSocket)?.emit('send-refresh-chart', true);
            } catch(err : any){
                toast.error(err.response.data.errorMessage);
            }

        }

        (store.state.SocketIOService?.getSocket)?.on('new-purchase', async() => {
            const response = (await HintService.isBought(props.hint.Id)).data;
            boughtHint.value = response.isBought;
            if(response.isBought){
                hintDesc.value = response.Description; 
            }else{
                hintDesc.value = ""; 
            }
        });

        return{hintModalId, hintDesc, boughtHint, buyHint}

    }
})
</script>


<style scoped lang="scss">

</style>