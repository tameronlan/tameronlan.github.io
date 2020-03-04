<template>
    <div class="incoming">
        <div class="incoming__content">
            <div v-if="isLoading" class="loader-wrap loader-wrap-inside">
                <loader/>
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
            </template>

            <div v-else class="incoming__empty">
                <i class="ico ico_black-heart"></i>
                <div class="incoming__empty-text" v-html="emptyStateText"></div>
                <div class="btn_primary btn_size-m" @click="$nav.push('/app/feed')" v-touch>
                    {{$t('incoming.empty.btn_view')}}
                </div>
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
                    this.isLoading = false;
                });
            },
            clickItem(item) {
                this.markAsRead(item);

                if (this.hasVip || item.open) {
                    feed.openProfile({id: item.user.id});
                } else if (this.isAutoOpen) {
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
