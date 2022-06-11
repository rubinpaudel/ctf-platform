<template>

    <div class="container-fluid d-flex flex-column align-items-center justify-content-center">

        <div class="btn-group mt-5">
            <h1 class="fw-bolder">
                PROFILE OVERVIEW
            </h1>
        </div>

        <div class="w-25" id="profileForm">
            <!-- Email -->
            <div class="form-outline mb-3">
                <label class="form-label">Email</label>
                <input readonly type="email" class="form-control" :value="myemail" />
            </div>

            <!-- Full Name -->
            <div class="form-outline mb-3">
                <label class="form-label">Full Name</label>
                <input readonly type="text" class="form-control" :value="myname"/>
            </div>

            <!-- Category -->
            <div class="form-outline mb-3">
                <label class="form-label">Category</label>
                <input readonly type="text" class="form-control" :value="mycategory" />
            </div>

        </div>

    </div>

</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue';
import { UserService } from '@/services/UserService';

const myemail = ref("");
const myname = ref("");
const mycategory = ref("");

export default defineComponent ({
    components : {},

    props : {},

    setup () {

        onBeforeMount(async () => {
            
            myemail.value = (await UserService.myEmail()).data.myEmail;
            myname.value = (await UserService.myName()).data.myName;
            mycategory.value = (await UserService.myCategory()).data.myCategory;

        })

        return{onBeforeMount, myemail, myname, mycategory};

    }

})
</script>

<style scoped lang="scss">

</style>