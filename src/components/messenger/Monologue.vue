<template>
    <div class="monologue">
        <div class="monologue__ava" :style="{ backgroundImage: `url(${avaSrc})` }"></div>
        <template v-if="openedContact.mutual_ts">
            <div class="monologue__mutual-title">{{$t('messenger_chat.mutual_label')}}</div>
            <div class="monologue__mutual-with ellipsis">{{$t('messenger_chat.mutual_you_and', {name:
                openedContact.user.name})}}
            </div>
            <div class="monologue__mutual-text" v-html="mutualText"></div>
        </template>
        <div v-else class="monologue__name" v-html="openedContact.user.name"></div>
        <component
                v-for="(message, i) in filteredMessages"
                :key="message.id"
                :is="getMessageComponent(message)"
                :contact="openedContact"
                :message="message"
                :layout-props="getMessageLayoutProps(i)"/>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import {getDateDiff, getSimpleHumanDate} from '@/lib/dateFunctions';
    import serverTime from '@/lib/serverTime';
    import Message from './Message';
    import MutualMessage from './MutualMessage';

    export default {
        name: 'Monologue',
        computed: {
            avaSrc() {
                return this.openedContact.user.avatars.s4;
            },
            mutualText() {
                return this.$t('messenger_chat.mutual_msg', {
                    name: this.openedContact.user.name,
                    dateDiff: this.dateDiff
                });
            },
            dateDiff() {
                return getSimpleHumanDate(this.openedContact.mutual_ts * 1000);
            },
            filteredMessages() {
                return this.messages.filter(message => message.id !== 'mutual');
            },
            ...mapState('messenger', ['openedContact', 'messages'])
        },
        methods: {
            getMessageComponent(message) {
                return message.mutual_ts ? MutualMessage : Message;
            },
            getMessageLayoutProps(i) {
                const props = {};

                if (i === 0) {
                    props.isFirst = true;
                }

                return props;
            }
        }
    }
</script>
