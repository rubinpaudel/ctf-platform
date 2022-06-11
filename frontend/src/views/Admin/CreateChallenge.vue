<template>
    <div class="container-fluid pt-5 h-100 d-flex flex-column align-items-center justify-content-center">
        
        <div class="w-50 mb-5 pb-5">
            
            <div class="text-center fw-bold">
                <h1> Create Challenge </h1>
                <p class="fs-6 fw-bold">What type of challenge do you want to create?</p>
            </div>
            <div class="mb-3">
                <label for="cc" class="form-label">Category</label>
                <select v-model="selectedChallengeType" class="form-select" required>
                    <option v-for="(ct, index) in ChallengeType" :value="ct.Value" :key="index">
                        {{ ct.Text }}
                    </option>
                </select>
            </div>

            <router-link :to="selectedChallengeType">
                <ButtonComponent class="w-100 my-2"> Start Challenge Creation </ButtonComponent>
            </router-link>

        </div>



    </div>

</template>

<script lang="ts">
import ButtonComponent from '@/components/ButtonComponent.vue';
import { defineComponent, ref } from 'vue';

//TODO : Add proper functionality.





export default defineComponent ({
    components : { ButtonComponent },
    setup () {

        const ChallengeType = [
                {Text : "Normal", Value : "create-normal-challenge"},
                {Text : "Quiz", Value : "create-quiz-challenge"},
                {Text : "Dockerized", Value : "create-dockerized-challenge"},
        ]

        const selectedChallengeType = ref<string>(ChallengeType[0].Value);


        return {ChallengeType, selectedChallengeType}
    }

})
</script>

<style scoped lang="scss">

</style>