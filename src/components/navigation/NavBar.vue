<template>
    <div class="nav-bar">
        <nav-tab
                v-for="(item, index) in tabs"
                :item="item"
                :key="index"
                :isActive="currentTabId === item.id"
                @click.native="$nav.push(item.link)"
        />
    </div>
</template>

<script>
    import NavTab from './NavTab';
    import {mapState} from 'vuex';
    import {TAB_FEED, TAB_INCOMING, TAB_MESSENGER, TAB_NEARBY, TAB_PROFILE} from "../../consts";

    export default {
        name: "NavBar",
        components: {NavTab},
        data() {
            return {
                tabs: [
                    {link: '/app/messenger', id: TAB_MESSENGER, ico: 'ico-nav ico-nav_message'},
                    {link: '/app/feed', id: TAB_FEED, ico: 'ico-nav ico-nav_meet'},
                    {link: '/app/incoming', id: TAB_INCOMING, ico: 'ico-nav ico-nav_symp'},
                    {link: '/app/profile', id: TAB_PROFILE, ico: 'ico-nav ico-nav_profile'}
                ]
            }
        },
        computed: {
            ...mapState(['currentTabId'])
        }
    }
</script>
