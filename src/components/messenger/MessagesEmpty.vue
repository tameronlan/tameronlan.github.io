<template>
    <div class="messages-empty">
        <div class="messages-empty__ava" :style="{ backgroundImage: `url(${avaSrc})` }"></div>
        <template v-if="openedContact.mutual_ts">
            <div class="messages-empty__mutual-title">{{$t('messenger_chat.mutual_label')}}</div>
            <div class="messages-empty__mutual-text" v-html="mutualText"></div>
        </template>
        <div v-else class="messages-empty__title">{{title}}</div>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import {GENDER_MAN} from '../../consts';
    import {getDateDiff, getSimpleHumanDate} from '@/lib/dateFunctions';
    import serverTime from '@/lib/serverTime';

    export default {
        computed: {
            avaSrc() {
                return this.openedContact.user.avatars.s4;
            },
            title() {
                let isMan = this.openedContact.user.gender === GENDER_MAN;
                return this.$t(isMan ? 'messenger_chat.empty_m' : 'messenger_chat.empty_f');
            },
            mutualText() {
                return this.$t('messenger_chat.mutual_msg', {name: this.openedContact.name, dateDiff: this.dateDiff});
            },
            dateDiff() {
                //return getDateDiff(serverTime.getActualTime() - this.openedContact.mutual_ts);
                return getSimpleHumanDate(this.openedContact.mutual_ts * 1000);
            },
            ...mapState('messenger', ['openedContact'])
        }
    };
</script>
