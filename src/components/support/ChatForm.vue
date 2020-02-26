<template>
    <div class="chat-form">
        <Form :isSending="isSending"
              :photoIsUploading="photoIsUploading"
              :placeholder="placeholder"
              @submitMessage="submitMessage"
              @submitFile="submitFile"></Form>
    </div>
</template>

<script>
    import Form from '../../components/messenger/Form';
    import {addComment, addFile, getChat} from '../../api/usedesk';

    export default {
        name: 'ChatForm',
        components: {Form},
        data() {
            return {
                isSending: false,
                photoIsUploading: false
            }
        },
        computed: {
            placeholder() {
                return this.$t("support_chat.placeholder");
            }
        },
        methods: {
            submitMessage(msg) {
                this.isSending = true;

                const formData = new FormData();
                formData.append('message', msg);

                addComment(formData).then(getChat).then(response => {
                    let messages = response.raw.result.comments || [];
                    this.$store.commit('usedesk/initMessages', messages);
                }).catch(error => {
                    console.log('submitMessage error', error);
                }).finally(() => {
                    this.isSending = false;
                });
            },
            submitFile(file) {
                this.photoIsUploading = true;

                const formData = new FormData();
                formData.append('file', file);

                addComment(formData).then(getChat).then(response => {
                    let messages = response.raw.result.comments || [];
                    this.$store.commit('usedesk/initMessages', messages);
                }).catch(error => {
                    console.log('submitFile error', error);
                }).finally(() => {
                    this.photoIsUploading = false;
                });
            }
        }
    }
</script>