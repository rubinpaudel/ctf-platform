//TODO : Add links everywhere

<template>

    <div class="container-fluid h-50 d-flex flex-column align-items-center justify-content-center mt-5 mb-5">

        <img src="../../assets/uhctf_logo.png" style="max-width: 50%;" class="img-fluid mx-auto d-block my-auto" alt="UHCTF logo">
        
        <!-- Log in button -->
        <ButtonComponent :onClick="onRegisterClick" class="mw-100 mb-1 btn btn-dark mt-5 rounded-pill fw-bolder">
            &ndash; &ndash; &ndash; &ndash; &ndash; &gt;    REGISTER NOW    &lt;&ndash; &ndash; &ndash; &ndash; &ndash;
        </ButtonComponent>

    </div>

</template>

<script lang="ts">
    import ButtonComponent from '@/components/ButtonComponent.vue';
    import { defineComponent } from 'vue';

    //TODO : Add proper functionality.

    export default defineComponent ({
        components : {ButtonComponent},

        props : {},

        setup () {
            const onRegisterClick = () => {
                console.log('Registering you...');
            }
            return {onRegisterClick}
        }

    })
</script>

<style lang="scss" scoped>

</style>