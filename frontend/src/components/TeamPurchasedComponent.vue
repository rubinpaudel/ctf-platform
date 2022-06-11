<template>
    <div class="container d-flex flex-column py-3" v-if="purchases.length > 0">
        
        <div class="header d-flex flex-row justify-content-between">
            <span>{{ team.Name }}</span>
        </div>

        <hr class="bg-light" />

        <div class="container-fluid">

            <div class="row w-100">
                <div class="col-3 mb-4" v-for="purchase in purchases" :key="purchase.Challenge.Id">
                    <div class="card rounded-3 text-dark fw-bolder">
                        <div class="card-body d-flex flex-column align-items-center">
                            <p>{{ purchase.Challenge.Name }}</p>
                            <p class="text-center text-truncate w-75" :title="purchase.Hint.Description">{{ purchase.Hint.Description }}</p>
                            <BIconTrash class="fs-2 mx-2" style="color:red" @click="deletePurchase(purchase.Id)"></BIconTrash>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script lang="ts">
import { TeamService } from '@/services/TeamService';
import { defineComponent, ref, onBeforeMount } from 'vue'
import {BIconTrash} from 'bootstrap-icons-vue'
import { useToast } from 'vue-toastification';

import { useStore } from 'vuex';
import { State } from '@/store';
import { Socket } from 'engine.io-client';
import { SocketIOService } from '@/services/SocketIOService'

export default defineComponent({
    components : {BIconTrash},
    props: { team : Object},
    setup (props) {
        
        const toast = useToast();
        const purchases = ref<any[]>([]);

        const store = useStore<State>();
        
        onBeforeMount(async () => {
            purchases.value = (await TeamService.getPurchasedHints(props.team?.Id)).data.purchasedHints;
        })

        const deletePurchase = async (purchaseId:number) => {
            try {
                let a = purchases.value.filter(purchase => purchase.Id == purchaseId);
                const response = await TeamService.removePurchasedHint(purchaseId);
                toast.success(`Successfully deleted!`);
                purchases.value = purchases.value.filter(purchase => purchase.Id !== purchaseId);

                (store.state.SocketIOService?.getSocket)?.emit('delete-purchase', (a[0].PurchasedBy.TeamId));
                (store.state.SocketIOService?.getSocket)?.emit('new-team');
                (store.state.SocketIOService?.getSocket)?.emit('send-refresh-chart', true);

            } catch (err : any) {
                toast.error("Couldn't delete purchased hint.")
            }

        };

        (store.state.SocketIOService?.getSocket)?.on('new-team', async() => {
            purchases.value = (await TeamService.getPurchasedHints(props.team?.Id)).data.purchasedHints;
        });

        return {purchases, deletePurchase}
    }
})
</script>

<style scoped lang="scss">
</style>