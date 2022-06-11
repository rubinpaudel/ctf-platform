<template>
    <div class="card my-3 text-dark fw-bolder">
        <div class="card-body d-flex flex-row justify-content-between">
            <span v-if="!editable">
                {{email}}
            </span>
            <input v-else type="text" v-model="newEmail" class="form-control w-75" @keypress.enter="onSaveClick">
            <div class="actions">
                
                <BIconSave2 class="mx-1 pointer" v-if="editable" v-on:click="onSaveClick"></BIconSave2>
                <BIconPencil class="mx-1 pointer" v-on:click="onMakeEditable"></BIconPencil>
                <BIconTrash class="mx-1 pointer" v-on:click="onDeleteClick"></BIconTrash>
            </div>
        </div>
    </div>
</template>

<script lang="ts">


import { BIconPencil, BIconTrash, BIconSave2 } from 'bootstrap-icons-vue';
import { defineComponent, ref } from 'vue';


export default defineComponent({
    components: {
        BIconPencil,
        BIconTrash,
        BIconSave2
    },
    props : {
        indexE : Number,
        email : String,
    },
    setup(props, {emit}) {
        
        const editable = ref<boolean>(false);
        const newEmail = ref<string>('');
        const onSaveClick = () => {
            const email = newEmail.value;
            onMakeEditable()
            if (email == props.email || email == "") return;
            emit('edit', {indexE : props.indexE, Email : email });
        }

        const onMakeEditable = () => {
            newEmail.value = props.email as string;
            editable.value = !editable.value;
        }


        const onDeleteClick = () => {
            emit('delete', { indexE : props.indexE });
        }

        return {
            onSaveClick,
            onMakeEditable,
            onDeleteClick,
            editable,
            newEmail
        }
    },


})


</script>

<style scoped lang="scss">
.pointer {
    cursor: pointer;
}
</style>