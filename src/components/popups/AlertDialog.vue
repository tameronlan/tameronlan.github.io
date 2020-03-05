<template>
    <div>
        <div class="popup__close" @click="close">
            <i class="ico ico_close-gray"></i>
        </div>
        <div class="alert-dialog__title popup__title">
            {{title ? title : 'Attention!'}}
        </div>
        <div class="alert-dialog__content">
            {{description}}
        </div>
        <div class="alert-dialog__actions">
            <div class="alert-dialog__action btn btn_orange ripple ripple_white" v-touch @click="close">
                {{btnText ? btnText : 'OK'}}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "alert-dialog",
        props: {
            title: {
                type: String
            },
            description: {
                type: String
            },
            onClose: {
                type: Function
            },
            btnText: {
                type: String
            },
            popup: {
                type: Object
            }
        },
        methods: {
            close(){
                this.$store.dispatch('popups/closePopup', {
                    popup: this.popup,
                    animated: true
                });
            }
        }
    }
</script>
