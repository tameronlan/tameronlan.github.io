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
    import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
    import messengerDataSource from './messenger/datasource';
    import messengerSocket from './messenger/socket';
    import messenger from './messenger';
    import Cookie from 'js-cookie';
    import {getMyInfo} from '@/api/profile';

    export default {
        name: 'app',
        components: {Loader, NavBar, Popups, Push},
        data(){
            return {
                cookie: ""
            }
        },
        computed: {
            ...mapState(['currentTabId', 'bannerIsShown']),
            ...mapState('feed', ['moderationStatus']),
            ...mapGetters('feed', ['numNotify']),
        },
        methods: {
            ...mapActions('common', ['setConfig']),
        },
        created(){
            let apiUrl = Cookie.get('apiUrl');
            let assistId = Cookie.get('assistId');
            let supportId = Cookie.get('supportId');
            let token = Cookie.get('token');
            let appVersionName = Cookie.get('appVersionName');
            let appVersionCode = Cookie.get('appVersionCode');
            let locale = Cookie.get('locale');
            let vendor = Cookie.get('vendor');
            let deviceId = Cookie.get('deviceId');

            this.setConfig({
                apiUrl,
                assistId,
                supportId,
                token,
                appVersionName,
                appVersionCode,
                locale,
                vendor,
                deviceId
            });

            this.$api.init({ apiUrl, token, vendor, deviceId, appVersionCode, appVersionName });

            // messengerSocket.init({});

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
