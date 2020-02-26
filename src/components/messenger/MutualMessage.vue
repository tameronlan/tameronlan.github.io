<template>
    <div class="mutual-message">
        <div class="mutual-message__title">{{$t('mutual_message.title')}}</div>
        <div class="mutual-message__text" v-html="this.$t('mutual_message.text', {dateDiff: dateDiff})"></div>
    </div>
</template>

<script>
    import {getDateDiff, getSimpleHumanDate} from '@/lib/dateFunctions';
    import serverTime from '@/lib/serverTime';

    export default {
        name: 'MutualMessage',
        props: ['contact', 'message', 'layout-props'],
        computed: {
            dateDiff() {
                //return getDateDiff(serverTime.getActualTime() - this.message.mutual_ts);
                return getSimpleHumanDate(this.message.mutual_ts * 1000);
            }
        }
    }
</script>
