<template>
    <div class="incoming">
        <div class="incoming__tabs">
            <div class="incoming__tab">{{$t('incoming.tab')}} <span v-if="counters.events.incoming > 0">+{{counters.events.incoming}}</span>
            </div>
        </div>
        <div v-if="hasVip" class="incoming__notify">{{$t('incoming.notify')}}</div>
        <div class="incoming__content">
            <div v-if="isLoading" class="loader-wrap loader-wrap-inside">
                <loader></loader>
            </div>
            <template v-else-if="list.length > 0">
                <div class="incoming__list">
                    <div class="incoming__list-item" v-for="(item, index) in list">
                        <incoming-item
                                :key="item.id"
                                :item="item"
                                :autoOpen="isAutoOpen"
                                @like="like(item)"
                                @dislike="dislike(item)"
                                @click.native="clickItem(item)"
                        />
                    </div>
                </div>
                <div v-if="!hasVip && !isAutoOpen" class="incoming__offer">
                    <div class="incoming__offer-message">{{$t('incoming.offer.msg')}}</div>
                    <button class="incoming__offer-btn btn_white btn_size-m" :disabled="isBuying" @click="showVipOffer"
                            v-touch>
                        {{trialIsAvailable ? $t('incoming.offer.btn_activate') : $t('incoming.offer.btn_become')}}
                    </button>
                </div>
            </template>
            <div v-else class="incoming__empty">
                <template v-if="needUploadPhoto">
                    <div class="incoming__empty-photo">{{$t('incoming.empty.photo_title')}}</div>
                    <div class="incoming__empty-text">{{emptyStateTextPhoto}}</div>
                    <button class="btn_primary btn_size-m" :disabled="isUploading" v-file-upload="onFileChange" v-touch>
                        {{$t('incoming.empty.bnt_add')}}
                    </button>
                </template>
                <template v-else>
                    <i class="ico ico_black-heart"></i>
                    <div class="incoming__empty-text" v-html="emptyStateText"></div>
                    <div class="btn_primary btn_size-m" @click="$nav.push('/app/feed')" v-touch>
                        {{$t('incoming.empty.btn_view')}}
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapGetters, mapMutations} from 'vuex';
    import {getIncoming, read, hide} from '../../api/events';
    import {feedClick} from '../../api/meeting';
    import Loader from '@/components/common/Loader';
    import IncomingItem from '@/components/sympathy/IncomingItem';
    import feed from '@/feed';
    import {GENDER_MAN, SOURCE_VIP_LIKES, CLICK_TYPE_YES, PLACEMENT_INCOMING} from '../../consts';
    import photoUploader from '@/popups/photoUploader';
    import interstitials from '../../advert/interstitials';

    export default {
        name: 'Incoming',
        components: {Loader, IncomingItem},
        data() {
            return {
                me: this.$store.state.config.user,
                isLoading: false,
                isUploading: false,
                isBuying: false,
                isAutoOpen: false,
                list: []
            }
        },
        computed: {
            emptyStateText() {
                let gender = this.isMan ? this.$t('incoming.empty.first_m') : this.$t('incoming.empty.first_w');
                return this.$t('incoming.empty.like', {gender: gender});
            },
            emptyStateTextPhoto() {
                let gender = this.isMan ? this.$t('incoming.empty.female') : this.$t('incoming.empty.male');
                return this.$t('incoming.empty.photo_msg', {gender: gender});
            },
            hasPhoto() {
                return true;
            },
            isMan() {
                return this.$store.state.config.user.gender === GENDER_MAN;
            },
            ...mapState('vip', ['hasVip']),
            ...mapState('feed', ['counters']),
            ...mapGetters('vip', ['trialIsAvailable']),
            ...mapGetters('feed', ['needUploadPhoto'])
        },
        created() {
            this.loadNotifications();
            this.loadPlacement();
        },
        methods: {
            loadNotifications() {
                this.isLoading = true;

                getIncoming({
                    offset: 0,
                    include: 'user,user.photos',
                    limit: 100
                }).then(response => {
                    this.list = response.objects;
                    this.isAutoOpen = response.meta.auto_open;
                    this.isLoading = false;
                    this.trackStatEvents();
                });
            },
            loadPlacement() {
                let placement = interstitials.getPlacement(PLACEMENT_INCOMING);

                if (placement) {
                    interstitials.load(PLACEMENT_INCOMING);
                }
            },
            trackStatEvents() {
                this.$nativeStat.trackFirebaseEvent('item_action', {screen: 'Likes', action: 'View'});
                this.$nativeStat.trackMetricaEvent('item_action', {'Likes': 'View'});
                this.$nativeStat.trackAppsFlyerEvent('fs_action', {af_content_type: 'Likes', ap_action: 'View'});

                let hasLikes = this.list.length > 0;
                let hasNewLikes = this.list.some(item => !item.is_read);

                if (hasLikes) {
                    this.$nativeStat.trackFirebaseEvent('item_action', {screen: 'Likes', action: 'Has Likes'});
                    this.$nativeStat.trackMetricaEvent('item_action', {'Likes': 'Has Likes'});
                    this.$nativeStat.trackAppsFlyerEvent('fs_action', {
                        af_content_type: 'Likes',
                        ap_action: 'Has Likes'
                    });
                } else {
                    if (this.needUploadPhoto) {
                        this.$nativeStat.trackFirebaseEvent('item_action', {screen: 'Likes', action: 'Has No Photo'});
                        this.$nativeStat.trackMetricaEvent('item_action', {'Likes': 'Has No Photo'});
                        this.$nativeStat.trackAppsFlyerEvent('fs_action', {
                            af_content_type: 'Likes',
                            ap_action: 'Has No Photo'
                        });
                    }
                }

                if (hasNewLikes) {
                    this.$nativeStat.trackFirebaseEvent('item_action', {screen: 'Likes', action: 'Has New Likes'});
                    this.$nativeStat.trackMetricaEvent('item_action', {'Likes': 'Has New Likes'});
                    this.$nativeStat.trackAppsFlyerEvent('fs_action', {
                        af_content_type: 'Likes',
                        ap_action: 'Has New Likes'
                    });
                }
            },
            clickItem(item) {
                this.markAsRead(item);

                if (this.hasVip || item.open) {
                    feed.openProfile({id: item.user.id});
                } else if (this.isAutoOpen) {
                    interstitials.present(PLACEMENT_INCOMING).then(() => {
                        this.loadPlacement();
                    });

                    feed.openProfile({id: item.user.id});
                } else {
                    feed.showLockedUser(item);
                }
            },
            like(item) {
                this.markAsRead(item);

                feedClick({to_user_id: item.user.id, type: CLICK_TYPE_YES});

                setTimeout(() => {
                    feed.showMutualSympathy(item.user);

                    this.list = this.list.filter(listItem => listItem.id !== item.id);
                }, 200);
            },
            dislike(item) {
                this.markAsRead(item);

                this.list = this.list.filter(listItem => listItem.id !== item.id);

                hide(item.user.id);
            },
            markAsRead(item) {
                if (!item.is_read) {
                    item.is_read = true;
                    read(item.user.id);
                    this.decreaseEventsCounter('incoming');
                }
            },
            showVipOffer() {
                feed.showVipFullOffer({source: SOURCE_VIP_LIKES});
            },
            onFileChange(fileInput) {
                if (this.isUploading) {
                    return;
                }

                this.isUploading = true;

                photoUploader.uploadPhoto(fileInput, true).then(response => {
                    this.isUploading = false;
                    this.$nativeStat.trackCommonEvent('my_photo_upload', {source: 'Likes'});
                    this.$nativeStat.trackAppsFlyerEvent('ap_my_photo_upload', {ap_source: 'Likes'});
                }).catch((error) => {
                    this.isUploading = false;

                    feed.showUploadError();
                })
            },
            ...mapMutations('feed', ['decreaseEventsCounter'])
        }
    }
</script>
