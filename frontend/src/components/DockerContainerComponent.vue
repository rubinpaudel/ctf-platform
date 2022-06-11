<template>
    <div>
        <div class="card rounded-3 text-dark fw-bolder p-0 my-2 pointer" data-bs-toggle="modal" :data-bs-target="`#imageModal${$props.image.DockerImageID}`" v-if="loaded">
            <div class="card-body d-flex justify-content-between">
                <span>
                    {{$props.image.Name}}
                </span>
                <span class="badge bg-success" v-if="containerIsRunning">
                    Running
                </span>
                
                <span class="badge bg-danger" v-else>
                    Not Running
                </span>

            </div>
        </div>

        <div class="modal fade" :id="`imageModal${$props.image.DockerImageID}`" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" :aria-labelledby="`imageModal${$props.image.DockerImageID}`" aria-hidden="true"
            v-if="loaded">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable mw-100 h-75 p-5">
                <div class="modal-content text-dark main-bg h-100">
                    <div class="modal-header border-0 shadow shadow-lg">
                        <div class="container-fluid p-0 d-flex flex-row justify-content-between">
                            <div class="title">
                                <span class="modal-title fw-bolder text-light" id="staticBackdropLabel">{{$props.image.Name}}</span>
                            </div>
                            <div class="actions">
                                <BIconEyeFill class="pointer icon mx-1" v-if="!isInspect" @click="toggleInspect"></BIconEyeFill>
                                <BIconEyeSlashFill class="pointer icon mx-1" v-if="isInspect" @click="toggleInspect"></BIconEyeSlashFill>
                                <BIconPlusCircle class="pointer icon mx-1" v-if="$props.image.Container == null" @click="createContainer"></BIconPlusCircle>
                                <BIconPlayCircle class="pointer icon mx-1" v-else-if="$props.image.Container !== null && !containerIsRunning" @click="startContainer"></BIconPlayCircle>
                                <BIconStopCircle class="pointer icon mx-1" v-else-if="$props.image.Container !== null && containerIsRunning" @click="stopContainer"></BIconStopCircle>
                            </div>
                        </div>
                    </div>

                    <div class="modal-body p-2 mb-0 h-100 log-bg shadow shadow-lg" v-if="isInspect">
                        <div class="container-fluid h-100 text-light d-flex flex-column py-4 px-3">
                            
                            <!-- General Info -->
                            <h6 class="py-0 mb-3 fw-bolder"> General </h6>

                            <div class="container-fluid px-1">
                                <p class="fs-6">
                                    <span class="text-muted me-5 fw-bolder">Image Name :</span>
                                    <span>{{$props.image.Name}}</span>
                                </p>
                                <hr class="">
                                <p class="fs-6">
                                    <span class="text-muted me-5 fw-bolder">Created At :</span>
                                    <span>{{(new Date($props.image.CreatedAt)).toDateString()}}</span>
                                </p>
                                <hr>
                            </div>

                            <h6 class="py-0 my-3 fw-bolder">Assigned Ports</h6>

                            <div class="container-fluid px-0" v-if="ports.DefaultPorts">
                                <div class="row px-0">
                                    
                                    <div class="col-12" v-for="p in ports.DefaultPorts" :key="p.DockerDefaultPortID">
                                        <p class="px-1"> {{p.PortMapping}}</p>
                                        <hr>
                                    </div>

                                </div>
                            </div>
                            
                            <div v-if="ports.ContainerPorts">
                                <h6 class="py-0 my-3 fw-bolder">Active Ports</h6>
    
                                <div class="container-fluid px-0">
                                    <div class="row px-0">
                                        <div class="col-12" v-for="p in ports.ContainerPorts" :key="p.DockerContainerPortID">
                                            <p class="px-1"> {{p.PortMapping}}</p>
                                            <hr>
                                        </div>
    
                                    </div>
                                </div>
                            </div>

                            
                            

                        </div>
                    </div>

                    <div class="modal-body p-2 mb-0 h-100 log-bg shadow shadow-lg" v-else>
                        <div class="container-fluid h-100 text-light py-2 scrollable">
                            <p v-for="(log, index) in containerLogs" :key="index" class="log-text"> {{log}} </p>
                        </div>
                    </div>
                    <div class="modal-footer border-0">
                        <button type="button" class="btn bg text-white fw-bold" data-bs-dismiss="modal" @click="closeConnection">Close</button>
                        <button type="button" class="btn bg text-white fw-bold" @click.prevent="startConnection">Get Logs</button>
                    </div>
                </div>
            </div>
        </div>
        
        
    </div>

</template>
<script lang="ts">
import { defineComponent, onBeforeMount, ref, watch } from 'vue'

import { BIconPlayCircle, BIconStopCircle, BIconPlusCircle, BIconEyeFill, BIconEyeSlashFill } from 'bootstrap-icons-vue'
import { DockerService } from '@/services/DockerService';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';
import { State } from '@/store';

export default defineComponent({
    components : {BIconPlayCircle, BIconStopCircle, BIconPlusCircle, BIconEyeFill, BIconEyeSlashFill},
    props : ['image', 'connect'],
    setup (props, {emit}) {
        const store = useStore<State>();
        const toast = useToast();
        const containerIsRunning = ref<boolean>(false);
        const connected = ref<boolean>(false);
        const containerLogs = ref<any[]>([]);
        const ports = ref<any>();
        const loaded = ref<boolean>(true);

        const isInspect = ref<boolean>(true);

        const hasContainer = () : boolean => { return props.image.Container != null; }

        const createContainer = async () => { 

            try {
                const response = await DockerService.createContainer(props.image);
                emit('created', {DockerImageID : props.image.DockerImageID, Container : response.data.Container});
                toast.success(response.data.message);
                (store.state.SocketIOService?.getSocket)?.emit('new-image');
            } catch (err : any) {
                toast.error(err.response.data.errorMessage);
            }
         }

        const startContainer = async () => {

            try {
                const response = await DockerService.startContainer(props.image);
                toast.success(response.data.message);
                containerIsRunning.value = true;
                (store.state.SocketIOService?.getSocket)?.emit('new-container');
            } catch (err : any) {
                toast.error(err.response.data.errorMessage);
            }

        }

        const stopContainer = async () => { 
            try {
                const response = await DockerService.stopContainer(props.image);
                toast.success(response.data.message);
                containerIsRunning.value = false;
                (store.state.SocketIOService?.getSocket)?.emit('new-container');
            } catch (err : any) {
                toast.error(err.response.data.errorMessage);
            }

        }

        const startConnection = async () => { 
            
            if (!connected.value) {
                connected.value = true;
                const socket = store.state.SocketIOService?.getSocket;
                try {
                    socket?.emit('docker-logs', {ContainerName : props.image.Container.Name});

                    socket?.on('log-stream', ({data}) => {
                        containerLogs.value.push(data);
                    })
                    socket?.on('docker-logs-error', ({data}) => containerLogs.value.push(data))

                } catch (err) { console.log(err)}
            } else toast.error('Already Connected!')

         }

        const closeConnection = async () => {
            connected.value = false;
            containerLogs.value = [];
            emit('close');
        }

        const toggleInspect =  () => {
            isInspect.value = !isInspect.value;
        }

        onBeforeMount(async () => {
            try {
                loaded.value = false;
                ports.value = (await DockerService.getPorts(props.image.DockerImageID)).data;
                if (props.image.Container){
                    containerIsRunning.value = (await DockerService.containerIsRunning(props.image)).data.IsRunning;
                }
                loaded.value = true;
            } catch (error) {
                return;
            }
        });

        (store.state.SocketIOService?.getSocket)?.on('new-container', async() => {
            containerIsRunning.value = (await DockerService.containerIsRunning(props.image)).data.IsRunning;
        });

        return { containerIsRunning, isInspect, toggleInspect, containerLogs, hasContainer, createContainer, stopContainer, startContainer, closeConnection, startConnection, ports , loaded}
    }
})
</script>

<style scoped lang="scss">

$white : #fff;
.bg {
    background-color: $white;
    color: #333 !important;
}

.icon {
    color : $white;
    font-size: x-large;
} 
.pointer {
    cursor: pointer;
}

.main-bg {
    background-color: #202c33;
}

.log-bg {
    background-color: #0d1214;
}

</style>