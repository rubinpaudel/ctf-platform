<template>
    <!-- Modal -->
    <div class="modal fade" :id="Id" tabindex="-1" :aria-labelledby="Id" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content bg-dark">
                <div class="modal-header">
                    <h5 class="modal-title">Are you sure ?</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-footer">
                        <button type="button" class="btn rounded-pill fw-bolder btn-secondary" data-bs-dismiss="modal">CANCEL</button>
                        <button type="button" class="btn rounded-pill w-25 fw-bolder btn-danger" data-bs-dismiss="modal" @click="onConfirmed">{{Message}}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent} from 'vue'
export default defineComponent({
    props : {
        Id : String,
        Message: String,
        onConfirmed : Function
    },
})

</script>

<style lang="scss" scoped>
</style>