<template>
    <div class="confirm-popup">
        <div class="confirm-popup__title">{{title}}</div>
        <div class="confirm-popup__message" v-html="message"></div>
        <div class="confirm-popup__actions">
            <div class="confirm-popup__action" @click="okClick">{{btnOk}}</div>
            <div class="confirm-popup__action" @click="cancelClick">{{btnCancel}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ConfirmPopup',
        props: ['title', 'message', 'btnOk', 'btnCancel'],
        methods: {
            okClick() {
                this.$nav.back({confirmed: true});
            },
            cancelClick() {
                this.$nav.back({confirmed: false});
            }
        }
    }
</script>
