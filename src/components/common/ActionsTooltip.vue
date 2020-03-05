<template>
    <div class="actions-dialog">
        <div class="actions-dialog__background" @click="$emit('close')"></div>
        <div class="actions-dialog__list">
            <template v-for="(item, index) in actions">
                <div v-if="item.fileUpload != undefined" v-file-upload="item.fileUpload" class="actions-dialog__item" :key="index">
                    {{item.label}}
                </div>
                <div v-else class="actions-dialog__item" @click="$emit('select', item.id)" :key="index">
                    {{item.label}}
                </div>
            </template>
        </div>
    </div>
</template>

<script>
    export default {
        name: "actions-tooltip",
        props: ['actions'],
    }
</script>
