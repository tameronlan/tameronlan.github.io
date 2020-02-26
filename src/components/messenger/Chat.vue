<template>
    <div class="messenger-chat">
        <div v-if="isLoading"></div>
        <template v-else-if="openedContact">
            <contact-header :contact="openedContact"/>
            <chat-photo-block v-if="requiresPhoto" :contact="openedContact"/>
            <template v-else>
                <div class="messenger-chat__body">
                    <messages/>
                </div>
                <sendbox/>
            </template>
        </template>
    </div>
</template>

<script>
    import {mapState, mapGetters, mapActions, mapMutations} from 'vuex';
    import Messages from '../../components/messenger/Messages';
    import Sendbox from '../../components/messenger/Sendbox';
    import datasource from '@/messenger/datasource';
    import ContactHeader from './ContactHeader';
    import ChatPhotoBlock from './ChatPhotoBlock';
    import messengerSocket from '../../messenger/socket';

    export default {
        components: {ContactHeader, ChatPhotoBlock, Messages, Sendbox},
        props: ['id'],
        data() {
            return {
                isLoading: false
            };
        },
        computed: {
            requiresPhoto() {
                return this.openedContact.requires_photo && this.needUploadPhoto;
            },
            ...mapState('messenger', ['openedContact']),
            ...mapGetters('feed', ['needUploadPhoto'])
        },
        created() {
            messengerSocket.checkConnection();

            this.loadContact();
        },
        destroyed() {
            this.closeContact();
        },
        methods: {
            loadContact() {
                this.isLoading = true;

                let contactId;

                if (this.$nav.activeIntent.params.id) {
                    contactId = this.$nav.activeIntent.params.id;
                } else if (this.id) {
                    contactId = this.id;
                }

                datasource.getContact(contactId).then(response => {
                    this.openContact(response.contact);
                    this.resetNewCounter(contactId);

                    this.isLoading = false
                });
            },
            navUpdated() {
                let contactId = this.$nav.activeIntent.params.id || this.id;

                if (this.openedContact && this.openedContact.id !== contactId) {
                    this.loadContact();
                }
            },
            ...mapActions('messenger', ['openContact', 'setContactSettings', 'closeContact', 'markReaded']),
            ...mapMutations('messenger', ['resetNewCounter'])
        }
    };
</script>
