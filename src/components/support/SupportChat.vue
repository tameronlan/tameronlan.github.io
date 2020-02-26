<template>
    <div class="support-chat extend">
        <div class="support-chat__head">
            <div class="support-chat__back" @click="$nav.back()">
                <div class="ico ico_back-gray"></div>
            </div>
            <div class="support-chat__avatar"></div>
            <div class="support-chat__name">{{$t("support_chat.name")}}</div>
        </div>
        <div class="support-chat__body">
            <messages-loader v-if="isLoading"/>
            <chat-messages v-else/>
        </div>
        <chat-form class="support-chat__form"></chat-form>
    </div>
</template>

<script>
    import MessagesLoader from '../messenger/MessagesLoader';
    import ChatMessages from '../support/ChatMessages';
    import ChatForm from '../support/ChatForm';
    import {getChat} from '../../api/usedesk';

    export default {
        name: 'SupportChat',
        components: {MessagesLoader, ChatMessages, ChatForm},
        data() {
            return {
                isLoading: false
            }
        },
        created() {
            this.loadChat();
        },
        methods: {
            loadChat() {
                this.isLoading = true;
                getChat().then(response => {
                    let messages = response.raw.result.comments || [];
                    this.$store.commit('usedesk/initMessages', messages);
                    this.$store.commit('feed/resetSupportCounter');
                    this.isLoading = false;
                });
            }
        }
    }
</script>