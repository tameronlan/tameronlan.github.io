<template>
    <div class="chat-messages" ref="scrollWrapper">
        <chat-message
                v-for="(message, i) in messages"
                :key="message.id"
                :message="message"
                :layout-props="getMessageLayoutProps(i)"/>
    </div>
</template>

<script>
    import ChatMessage from './ChatMessage';
    import {mapState} from 'vuex';

    export default {
        name: 'ChatMessages',
        components: {ChatMessage},
        data() {
            return {
                scrolledBottomOnce: false,
                wrapperHeight: 0,
                savedScrollHeight: 0,
                savedScrollValue: 0
            }
        },
        computed: {
            ...mapState('usedesk', ['messages'])
        },
        mounted() {
            this.scrollToBottom();
        },
        updated() {
            this.scrollToBottom();
        },
        methods: {
            scrollToBottom() {
                this.$refs.scrollWrapper.scrollTop = this.$refs.scrollWrapper.scrollHeight - this.$refs.scrollWrapper.clientHeight;
            },
            getMessageLayoutProps(i) {
                const props = {};

                if (i === 0) {
                    props.isFirst = true;
                }

                if (i === this.messages.length - 1) {
                    props.isLast = true;
                }

                const prev = i > 0 ? this.messages[i - 1] : null;
                const current = this.messages[i];
                const next = i < this.messages.length - 1 ? this.messages[i + 1] : null;

                if (!prev || prev.from !== current.from) {
                    props.isUserFirst = true;
                }
                if (!next || next.from !== current.from) {
                    props.isUserLast = true;
                }

                if (current.from === 'client') {
                    props.isMine = true;
                }

                return props;
            }
        },
        watch: {
            messages() {
                this.$nextTick(() => {
                    this.scrollToBottom();
                });
            }
        }
    }
</script>