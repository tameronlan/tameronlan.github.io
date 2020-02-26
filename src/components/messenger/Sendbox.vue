<template>
    <div class="messenger-sendbox">
        <restriction v-if="openedContact.restriction_message" :message="openedContact.restriction_message"/>
        <Form v-else
              :user="openedContact.user"
              :isSending="isSending"
              :photoIsUploading="photoIsUploading"
              :placeholder="placeholder"
              @submitMessage="submitMessage"
              @submitFile="submitFile"></Form>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import Form from '../../components/messenger/Form';
    import Restriction from '../../components/messenger/Restriction';
    import datasource from '@/messenger/datasource';
    import {MESSAGE_TYPE_TEXT, MESSAGE_TYPE_PHOTO, GENDER_MAN} from '../../consts';

    export default {
        components: {Form, Restriction},
        data() {
            return {
                isSending: false,
                photoIsUploading: false,
                me: {
                    id: 111,
                    avatars: {
                        s1: '',
                        s2: '',
                        s3: '',
                    }
                }
            }
        },
        computed: {
            placeholder() {
                let isMan = this.openedContact.user.gender === GENDER_MAN;
                let pronouns = isMan ? this.$t('personal_pronouns.him') : this.$t('personal_pronouns.her');

                return this.$t('messenger_chat.placeholder', {pronouns: pronouns});
            },
            ...mapState('messenger', ['openedContact'])
        },
        methods: {
            submitMessage(msg) {
                if (this.isSending) {
                    return;
                }

                this.isSending = true;

                this.postMessage({
                    message: msg.trim()
                }).then(() => {
                    this.isSending = false;
                });
            },
            submitFile(file) {
                const formData = new FormData();

                formData.append('contactId', this.openedContact.id);
                formData.append('file', file);

                this.photoIsUploading = true;

                datasource.postMessage(formData)
                    .then(() => {})
                    .finally(() => {
                        this.photoIsUploading = false;
                    });
            },
            ...mapActions('messenger', ['postMessage'])
        }
    };
</script>