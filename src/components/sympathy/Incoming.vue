<template>
    <div class="incoming">
        <div class="incoming__top">
            События <div class="incoming__counter">+1</div>
        </div>

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
                                @click.native="clickItem(item)"
                        />
                    </div>
                </div>
            </template>

            <div v-else class="incoming__empty">
                <div class="incoming__empty-text" v-html="emptyStateText"></div>
                <div class="btn btn_orange ripple ripple_white" @click="$nav.push('/app/feed')" v-touch>
                    {{$t('incoming.empty.btn_view')}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapGetters, mapMutations} from 'vuex';
    import {getIncoming} from '../../api/events';
    import Loader from '@/components/common/Loader';
    import IncomingItem from '@/components/sympathy/IncomingItem';
    import feed from '@/feed';
    import {GENDER_MAN} from '../../consts';
    import photoUploader from '@/popups/photoUploader';

    export default {
        name: 'Incoming',
        components: {Loader, IncomingItem},
        data() {
            return {
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
            isMan() {
                return this.currentUser.gender === GENDER_MAN;
            },
            ...mapState('vip', ['hasVip']),
            ...mapState(['currentUser']),
            ...mapState('feed', ['counters']),
            ...mapGetters('vip', ['trialIsAvailable']),
            ...mapGetters('feed', ['needUploadPhoto'])
        },
        created() {
            this.loadNotifications();
        },
        methods: {
            loadNotifications() {
                this.isLoading = true;

                getIncoming({
                    offset: 0,
                    include: 'user,user.photos',
                    limit: 100
                }).then(response => {
                    this.list = response.data.list;
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
            markAsRead(item) {

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
                }).catch(() => {
                    this.isUploading = false;
                    feed.showUploadError();
                })
            },
            ...mapMutations('feed', ['decreaseEventsCounter'])
        }
    }
</script>
