<template>
    <div class="app">
        <nav-view/>
        <nav-bar v-if="currentTabId !== 0"/>
        <popups/>
        <push/>
    </div>
</template>

<script>
    import Loader from './components/common/Loader';
    import Popups from './components/popups/Popups';
    import Push from './components/push/Push';
    import NavBar from './components/navigation/NavBar';
    import bridge from './bridge';
    import {mapState, mapGetters, mapMutations} from 'vuex';
    import messengerDataSource from './messenger/datasource';
    import messengerSocket from './messenger/socket';
    import messenger from './messenger';

    export default {
        name: 'app',
        components: {Loader, NavBar, Popups, Push},
        computed: {
            ...mapState(['currentTabId', 'bannerIsShown']),
            ...mapState('feed', ['moderationStatus']),
            ...mapGetters('feed', ['numNotify']),
        },
        created(){
            messengerSocket.init({});
            messenger.userId = 111;
            messenger.dataSource = messengerDataSource;
        },
        watch: {
            moderationStatus(newStatus) {

            },
            numNotify(newValue) {
                bridge.invokeNative('set_badge', {value: newValue.toString()});
            }
        }
    }
</script>
