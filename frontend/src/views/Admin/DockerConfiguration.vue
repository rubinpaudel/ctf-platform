<template>

    <div class="container-fluid pt-5 h-100 d-flex flex-column align-items-center justify-content-center">
        <h1 class="fw-bolder" id="dropdownMenuButton" aria-expanded="false">
            DOCKER
        </h1>
        

        <div class="container-fluid">
            
            <div class="container d-flex flex-column py-3">
                
                <div class="my-2">
                    <div class="header d-flex flex-row justify-content-between">
                        <span>Images</span>
                    </div>
    
                    <hr class="bg-light" />
    
                    <div class="container-fluid p-0">
                        
                        <DockerContainerComponent 
                            v-for="(image, index) in images" 
                            :key="image.DockerImageID" 
                            :connect="index == openedModal" 
                            :image="image" @click="onModalOpen(index)" 
                            v-on:close="onModalClose"
                            v-on:created="onCreatedContainer"
                            >
                        </DockerContainerComponent>                        

                    </div>
                </div>

            </div>

        </div>

    </div>
    
</template>

<script lang="ts">

import DockerContainerComponent from '@/components/DockerContainerComponent.vue';
import { DockerService } from '@/services/DockerService';
import { defineComponent, onBeforeMount, ref } from 'vue';
import { useStore } from 'vuex';
import { State } from '@/store';

export default defineComponent({


    components: {DockerContainerComponent},
    setup () {
        
        const images = ref<any[]>([]);
        const openedModal = ref<number>(-1);
        const store = useStore<State>();

        const onModalClose = () => {
            openedModal.value = 80;
        }
        const onModalOpen = (index : number) => openedModal.value = index;

        onBeforeMount(async () => {
            images.value = (await DockerService.getImages()).data.Images;
        })

        const onCreatedContainer = (data : any) => {
            images.value.forEach((i) => {
                if (i.DockerImageID == data.DockerImageID)
                    i.Container = data.Container;
            })
        } 

        (store.state.SocketIOService?.getSocket)?.on('new-image', async() => {
            images.value = (await DockerService.getImages()).data.Images;
        });

        return {images, openedModal, onModalClose, onModalOpen, onCreatedContainer};
    }

});




</script>

<style lang="scss" scoped>
</style>