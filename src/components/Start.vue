<template>
    <div>
        <div class="loader-wrap loader-wrap-inside">
            <loader/>
        </div>
    </div>
</template>

<script>
    import Loader from './common/Loader';
    import Popups from './popups/Popups';
    import Push from './../components/push/Push';
    import feed from './../feed/';
    import interstitials from './../advert/interstitials';
    import bottomBanner from './../advert/bottomBanner';
    import bridge from './../bridge';
    import {mapState, mapGetters} from 'vuex';
    import {Trans} from './../plugins/Translation';
    import {PLACEMENT_FEED, PLACEMENT_PROFILE, PLACEMENT_INCOMING, AVATAR_STATUS_APPROVED} from './../consts';
    import serverTime from './../lib/serverTime';
    import {getConfig} from './../api/meeting';

    export default {
        name: "start",
        components: {Loader, Popups, Push},
        computed: {
            ...mapGetters('feed', ['numNotify'])
        },
        data() {
            return {
                isLoading: true
            }
        },
        created() {
            this.getApiHost()
                .then(response => {
                    this.$api.init({api_url: response.api_url});

                    let curDate = new Date();

                    return getConfig({
                        timezone_offset: curDate.getTimezoneOffset() * -1
                    });
                })
                .then(response => {
                    if (response.user === undefined) {
                        bridge.invokeNative('update_access_token');
                    }

                    return this.loadLocalization({});
                })
                .then(response => {
                    this.init(response);
                    this.isLoading = false;
                })
                .catch(error => {
                    console.log('app init error', error);
                });
        },
        methods: {
            getApiHost() {
                return new Promise((resolve, reject) => {
                    if (bridge.isSupported()) {
                        bridge.invokeNative('get_api_host', {}, response => {
                            resolve(response);
                        });
                    } else {
                        reject({message: 'get_api_host failed'});
                    }
                });
            },
            loadLocalization(config) {
                const lang = config.lang || Trans.defaultLanguage;

                return new Promise(resolve => {
                    Trans.changeLanguage(lang).then(response => {

                    }).catch(error => {
                        console.log('loadLocalization error', error);
                    }).finally(() => {
                        resolve(config);
                    });
                });
            },
            init(config) {
                this.$store.state.config = config;

                this.$store.dispatch('feed/init', config);
                this.$store.dispatch('vip/init', config);

                bridge.invokeNative('set_photo_status', {fs_photo: config.avatar_status});
                bridge.invokeNative('set_badge', {value: this.numNotify.toString()});

                serverTime.init(config.server_time || parseInt(new Date().getTime() / 1000));

                // if (config.adv) {
                //     this.initPlacements(config.adv);
                // }

                if (true || config.user){
                    this.$nav.redirect('/app/feed');
                } else {
                    this.$nav.redirect('/app/signup');
                }
            },
            initPlacements(advert) {
                interstitials.init();

                if (advert.feed_swipe) {
                    interstitials.createPlacement({name: PLACEMENT_FEED, options: advert.feed_swipe});
                }

                if (advert.profile_close) {
                    interstitials.createPlacement({name: PLACEMENT_PROFILE, options: advert.profile_close});
                }

                if (advert.incoming_open && advert.incoming_open.place_id > 0) {
                    interstitials.createPlacement({name: PLACEMENT_INCOMING, options: advert.incoming_open});
                }

                if (advert.sticky && advert.sticky.place_id > 0) {
                    bottomBanner.init(advert.sticky);
                    bottomBanner.show();
                }
            }
        },
    }
</script>
