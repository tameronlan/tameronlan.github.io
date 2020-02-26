<template>
    <div class="nav-tab ripple ripple_lightblue" :class="{active: isActive}" v-touch>
        <div class="nav-tab__ico">
            <div :class="[isActive ? `${item.ico}-active`:`${item.ico}`]"></div>
            <div v-if="count > 0" class="nav-tab__count">{{count | counterLimit}}</div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: "NavTab",
        props: ['item', 'isActive'],
        computed: {
            count() {
                return this.tabCounter(this.item.id);
            },
            ...mapGetters('feed', ['tabCounter'])
        }
    }
</script>
