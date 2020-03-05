<template>
    <div class="app">
        <template v-if="isLoading">
            <div class="app__loader">
                <loader/>
                <div class="app__loader-title">
                    {{$t('loading_dots')}}
                </div>
            </div>
        </template>
        <template v-else>
            <nav-view/>
            <nav-bar v-if="currentTabId !== 0"/>
            <popups/>
            <push/>
        </template>
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
    import {getConfig} from '@/api/meeting';
    import {getMyInfo} from '@/api/profile';
    import {Trans} from './plugins/Translation';
    import serverTime from './lib/serverTime';

    export default {
        name: 'app',
        components: {Loader, NavBar, Popups, Push},
        data(){
            return {
                cookie: "",
                isLoading: false
            }
        },
        computed: {
            ...mapState(['currentTabId', 'bannerIsShown']),
            ...mapState('feed', ['moderationStatus']),
            ...mapGetters('feed', ['numNotify']),
            ...mapGetters('common', ['config']),
            ...mapGetters(['currentUser']),
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
            let wsChatUrl = Cookie.get('wsChatUrl');

            console.log("App::created");

            if (apiUrl === undefined){
                apiUrl = "http://cloud.sweetmeet.me/oapi/method";
                // apiUrl = location.origin + "/oapi/method";
            }

            this.setConfig({
                apiUrl,
                assistId,
                supportId,
                token,
                appVersionName,
                appVersionCode,
                locale,
                vendor,
                wsChatUrl,
                deviceId
            });

            serverTime.init(parseInt(new Date().getTime() / 1000));

            this.$api.init({
                locale,
                apiUrl,
                token,
                vendor,
                deviceId,
                appVersionCode,
                appVersionName
            });

            this.loadLocalization(locale)
                .then(getConfig)
                .then(this.getMyInfo)
                .then(() => {
                    this.init();
                    this.isLoading = false;
                });
        },
        watch: {
            moderationStatus(newStatus) {},
            numNotify(newValue) {
                bridge.invokeNative('set_badge', {value: newValue.toString()});
            }
        },
        methods: {
            loadLocalization(locale) {
                const lang = locale || Trans.defaultLanguage;

                return new Promise(resolve => {
                    Trans.changeLanguage(lang)
                        .catch(error => {
                            console.log('loadLocalization error', error);
                        }).finally(resolve);
                });
            },
            getMyInfo() {
                if (this.config.token === undefined){
                    return new Promise(resolve => resolve());
                } else {
                    return getMyInfo();
                }
            },
            init (config={}) {
                messengerSocket.init(this.config);

                messenger.userId = 111;
                messenger.dataSource = messengerDataSource;

                this.$store.dispatch('feed/init', config);
                this.$store.dispatch('vip/init', config);

                bridge.invokeNative('set_photo_status', {fs_photo: config.avatar_status});
                bridge.invokeNative('set_badge', {value: this.numNotify.toString()});
            },
            ...mapActions('common', ['setConfig']),
        },
    }
</script>
