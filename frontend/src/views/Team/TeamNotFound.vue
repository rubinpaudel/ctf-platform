<template>
    <div class="container-fluid h-100 d-flex flex-column align-items-center justify-content-center">
        <h1 class="display-1 fw-bolder">404</h1>
        <h3 class="display-3">Team not found</h3>
        <p class="fs-5">Pssst... you can still create one yourself</p>
        <router-link to="/team/create" class="w-100 text-center">
            <ButtonComponent>
                Create Team
            </ButtonComponent>
        </router-link>
        
    </div>
</template>

<script lang="ts">

import ButtonComponent from '@/components/ButtonComponent.vue';



export default {

    components : {ButtonComponent},
    setup () {

        const onCreateTeamClick = () => {
            console.log('Sending you to create team page ....');
        }

        return {onCreateTeamClick}

    }

}





</script>

<style scoped>

</style>