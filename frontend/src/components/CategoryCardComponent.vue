<template>
    <div class="card my-3 text-dark fw-bolder">
        <div class="card-body d-flex flex-row justify-content-between">
            <span v-if="!editable">
                {{categoryName}}
            </span>
            <input v-else type="text" v-model="newName" class="form-control w-75" @keypress.enter="onSaveClick">


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
        categoryID : Number, // TODO: Change this later when API is done
        categoryName : String,
    },
    setup(props, {emit}) {
        
        const editable = ref<boolean>(false);
        const newName = ref<string>('');
        const onSaveClick = () => {
            const name = newName.value;
            onMakeEditable()
            if (name == props.categoryName || name == "") return;
            emit('edit', {id : props.categoryID, Name : name });
        }

        const onMakeEditable = () => {
            newName.value = props.categoryName as string;
            editable.value = !editable.value;
        }


        const onDeleteClick = () => {
            emit('delete', { id : props.categoryID });
        }

        return {
            onSaveClick,
            onMakeEditable,
            onDeleteClick,
            editable,
            newName
        }
    },


})


</script>

<style scoped lang="scss">
.pointer {
    cursor: pointer;
}
</style>