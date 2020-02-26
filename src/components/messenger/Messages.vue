<template>
    <div class="messenger-messages-wrapper" ref="scrollWrapper">
        <div class="messenger-messages">
            <monologue v-if="this.messages.length && !contact.has_my_messages"/>
            <template v-else>
                <component
                        v-for="(message, i) in messages"
                        :key="message.id"
                        :is="getMessageComponent(message)"
                        :contact="contact"
                        :message="message"
                        :layout-props="getMessageLayoutProps(i)"/>
            </template>

            <messages-loader v-if="isLoading"/>

            <messages-empty v-if="isEmpty"/>
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import messenger from '@/messenger';
    import Message from './Message';
    import MutualMessage from './MutualMessage';
    import MessagesLoader from './MessagesLoader';
    import MessagesEmpty from './MessagesEmpty';
    import Monologue from './Monologue';

    export default {
        components: {MessagesEmpty, MessagesLoader, Monologue},
        data() {
            return {
                scrolledBottomOnce: false,
                isLoadingHistoryTriggered: false,
                wrapperHeight: 0,
                savedScrollHeight: 0,
                savedScrollValue: 0
            };
        },
        computed: {
            ...mapState('messenger', {
                contact: state => state.openedContact,
                messages: state => state.messages,
                isLoading: state => state.messagesIsLoading,
                hasPrev: state => state.messagesHasPrev
            }),
            isEmpty() {
                return !this.isLoading && !this.messages.length;
            }
        },
        watch: {
            contact() {
                this.scrolledBottomOnce = false;
            },
            messages() {
                // Значения до обновления DOM сообщений
                this.savedScrollHeight = this.$refs.scrollWrapper.scrollHeight;
                this.savedScrollValue = this.$refs.scrollWrapper.scrollTop;

                this.$nextTick(() => { // DOM сообщений обновился
                    const newScrollHeight = this.$refs.scrollWrapper.scrollHeight;

                    if (!this.scrolledBottomOnce) { // Первый раз загрузили сообщения
                        if (newScrollHeight > this.wrapperHeight) {
                            this.$refs.scrollWrapper.scrollTop = newScrollHeight - this.wrapperHeight;
                            this.scrolledBottomOnce = true;
                        }
                    } else if (this.isLoadingHistoryTriggered) { // Загружалась история
                        this.$refs.scrollWrapper.scrollTop = this.savedScrollValue + (newScrollHeight - this.savedScrollHeight);
                    } else { // Прилетело новое сообщение
                        if (this.savedScrollHeight - this.wrapperHeight - this.savedScrollValue < 100) {
                            this.$refs.scrollWrapper.scrollTop = newScrollHeight - this.wrapperHeight;
                        }
                    }
                });
            },
        },
        mounted() {
            this.loadMessagesBatch();

            this.wrapperHeight = this.$refs.scrollWrapper.clientHeight;

            this.$refs.scrollWrapper.addEventListener('scroll', this.onScroll);
        },
        updated() {
            this.wrapperHeight = this.$refs.scrollWrapper.clientHeight;
        },
        methods: {
            ...mapActions('messenger', ['loadMessagesBatch']),
            onScroll() {
                if (!this.hasPrev || this.isLoading) {
                    return;
                }

                if (this.$refs.scrollWrapper.scrollTop < 20) {
                    this.isLoadingHistoryTriggered = true;
                    this.loadMessagesBatch();
                }
            },
            getMessageComponent(message) {
                return message.mutual_ts ? MutualMessage : Message;
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

                if (!prev || prev.author_id !== current.author_id) {
                    props.isUserFirst = true;
                }
                if (!next || next.author_id !== current.author_id) {
                    props.isUserLast = true;
                }

                if (current.author_id === messenger.userId) {
                    props.isMine = true;
                }

                return props;
            }
        }
    };
</script>
