<template>
    <button @click="onClick" class="btn btn-lg w-50 border border-black rounded-0">
        <slot></slot>
    </button>
</template>

<script lang="ts">

export default {

    props : {
        onClick : Function
    },
}



</script>

<style lang="scss" scoped>

button  {

    background-color: white;
    color: #121212;
}

</style>