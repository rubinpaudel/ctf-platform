<template>
    <div class="container-fluid h-100 d-flex flex-column align-items-center justify-content-center pt-5">
        <img src="../../assets/404.svg" alt="" class="img-fluid w-50 mw-400">
        <h3 class="display-3 mt-3">Page not found</h3>
        <p class="fs-5">Go back to the application</p>
        <router-link to="/scoreboard/" class="w-100 text-center">
            <ButtonComponent>
                Return            
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