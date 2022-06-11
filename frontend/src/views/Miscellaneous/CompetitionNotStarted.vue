<template>
    <div class="container-fluid h-100 d-flex flex-column align-items-center justify-content-center pt-5">
        <img src="../../assets/competition.svg" alt="" class="img-fluid w-50 mw-400">
        <h3 class="display-3">Competition not started yet.</h3>
        <p class="fs-5">You can start by looking for a team first if you haven't already.</p>
        <router-link to="/team/find" class="w-100 text-center">
            <ButtonComponent>
                Browse Teams           
            </ButtonComponent>
        </router-link>
    </div>

</template>

<script lang="ts">
import ButtonComponent from '@/components/ButtonComponent.vue';
import { defineComponent } from 'vue';

export default defineComponent ({
    components : {ButtonComponent},
})
</script>

<style lang="scss" scoped>
.mw-400 {
    max-width: 400px;
}
</style>