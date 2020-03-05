<template>
    <div class="user-profile extend">
        <div v-if="isLoading" class="loader-wrap loader-wrap-inside">
            <loader></loader>
        </div>

        <template v-else>
            <div class="user-profile__sticky">
                <div class="user-profile__exit" @click="$nav.back()"><i class="ico ico_arrow-left-white-24"></i></div>
                <div class="user-profile__menu" @click="isOpeningActionsTooltip = true"><i class="ico2 ico2_menu"></i></div>
            </div>

            <div class="user-profile__content" ref="content">
                <div class="user-profile-photo"
                     :style="{backgroundImage: `url(${getPhotoUrl(0)})`}"
                     @click="openPhoto(0)">

                    <div class="user-profile-photo__info">
                        <div class="ico ico_photo-white"></div> 1 / 13
                    </div>
                </div>

                <div class="user-profile__info">
                    <div class="user-profile-info user-profile-info_base">
                        <div class="user-profile-info__header">
                            <div class="user-profile-info__title ellipsis">
                                <span class="online-status"></span>Name, 32
                            </div>
                        </div>
                        <div class="user-profile-info__content user-profile-info__content_location">
                            <div class="ico ico_location"></div>Moscow
                        </div>
                    </div>

                    <div class="user-profile-info user-profile-info_photo">
                        <div class="user-profile-info__header">
                            <div class="user-profile-info__title">Photo</div>
                        </div>

                        <div class="user-profile-info__content">
                            <div class="user-profile-photos">
                                <div class="user-profile-photos__group">
                                    <div class="user-profile-photos__item" style="background-image: url('https://im0-tub-ru.yandex.net/i?id=aaa0c700a686125e286e3d2aac86fd91&n=33&w=225&h=150')"></div>
                                </div>
                                <div class="user-profile-photos__group">
                                    <div class="user-profile-photos__shower">
                                        <div class="ico ico_photo-white"></div>
                                        Ещё 2 фото
                                    </div>
                                    <div class="user-profile-photos__item" style="background-image: url('https://im0-tub-ru.yandex.net/i?id=2a81d92675aa40ca17cc84259845ba60&n=33&w=221&h=150')"></div>
                                </div>
                            </div>
                            <div class="user-profile-photos">
                                <div class="user-profile-photos__group">
                                    <div class="user-profile-photos__item" style="background-image: url('https://im0-tub-ru.yandex.net/i?id=aaa0c700a686125e286e3d2aac86fd91&n=33&w=225&h=150')"></div>
                                </div>
                                <div class="user-profile-photos__group">
                                    <div class="user-profile-photos__shower">
                                        <div class="ico ico_photo-white"></div>
                                        Ещё 2 фото
                                    </div>
                                    <div class="user-profile-photos__item user-profile-photos__item_small" style="background-image: url('https://im0-tub-ru.yandex.net/i?id=2a81d92675aa40ca17cc84259845ba60&n=33&w=221&h=150')"></div>
                                    <div class="user-profile-photos__item user-profile-photos__item_small" style="background-image: url('https://im0-tub-ru.yandex.net/i?id=2a81d92675aa40ca17cc84259845ba60&n=33&w=221&h=150')"></div>
                                    <div class="user-profile-photos__item user-profile-photos__item_small" style="background-image: url('https://im0-tub-ru.yandex.net/i?id=2a81d92675aa40ca17cc84259845ba60&n=33&w=221&h=150')"></div>
                                    <div class="user-profile-photos__item user-profile-photos__item_small" style="background-image: url('https://im0-tub-ru.yandex.net/i?id=2a81d92675aa40ca17cc84259845ba60&n=33&w=221&h=150')"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="user-profile-info">
                        <div class="user-profile-info__header">
                            <div class="user-profile-info__title">Title</div>
                        </div>
                        <div class="user-profile-info__content">
                            Люблю гулять под луной. Живу с родителями. Я танцую и пою, и себя не узнаю. А еще много чит...
                        </div>
                    </div>

                    <div class="user-profile-info">
                        <div class="user-profile-info__header">
                            <div class="user-profile-info__title">Title</div>
                        </div>
                        <div class="user-profile-info__content">
                            Люблю гулять под луной. Живу с родителями. Я танцую и пою, и себя не узнаю. А еще много чит...
                        </div>
                    </div>

                    <div class="user-profile-info">
                        <div class="user-profile-info__header">
                            <div class="user-profile-info__title">Title</div>
                        </div>
                        <div class="user-profile-info__content">
                            Люблю гулять под луной. Живу с родителями. Я танцую и пою, и себя не узнаю. А еще много чит...
                        </div>
                    </div>
                </div>
            </div>

            <div :class="actionsClasses">
                <profile-actions @like="likeAction" @dislike="dislikeAction"/>
            </div>
        </template>

        <actions-tooltip v-if="isOpeningActionsTooltip"
                         :actions="actions"
                         @close="isOpeningActionsTooltip = false"
                         @select="onSelectAction"/>
    </div>
</template>

<script>
    import Loader from '@/components/common/Loader';
    import ProfileActions from '@/components/profile/ProfileActions';
    import InlineMessage from '@/components/common/InlineMessage';
    import RequirePhoto from './RequirePhoto';
    import {getUser} from '@/api/meeting';
    import {postMessage} from '@/api/chat';
    import {mapState, mapGetters, mapMutations} from 'vuex';
    import feed from '@/feed/';
    import {GENDER_MAN, SOURCE_VIP_CHAT_REQUEST_LIMIT} from '../../consts';
    import photoviewer from '@/popups/photoviewer';
    import profileInterstitial from '../../advert/profileInterstitial';
    import ActionsTooltip from '../common/ActionsTooltip';

    let _selfVM = '';

    export default {
        name: "UserProfile",
        components: {Loader, ProfileActions, InlineMessage, RequirePhoto, ActionsTooltip},
        props: ['id', 'card'],
        data() {
            return {
                me: {},
                user: null,
                focused: false,
                isLoading: false,
                actionCollapsed: false,
                isOpeningActionsTooltip: false,
                actions: [
                    {
                        label: 'Пожаловаться',
                        id: 1,
                    },
                    {
                        label: 'Заблокировать пользователя',
                        id: 2,
                    },
                ]
            }
        },
        computed: {
            numPhotos() {
                return 1;
            },
            isMe() {
                return false;
            },
            actionsClasses(){
                let classes = ['user-profile__bottom'];

                if (this.actionCollapsed){
                    classes.push('user-profile__bottom_big')
                }

                return classes;
            },
            ...mapState('vip', ['hasVip']),
            ...mapState('feed', ['likeActionLocked', 'viewedCardsAfterPhotoRequest']),
            ...mapGetters('vip', ['trialIsAvailable']),
            ...mapGetters('feed', ['needUploadPhoto', 'numCardsBeforeRequestPhoto', 'canOpenDialog'])
        },
        created() {
            let intent = this.$nav.activeIntent;
            let user = this.card || intent.options.user;

            _selfVM = this;

            if (user) {
                this.user = user;
            } else {
                this.isLoading = true;

                let id = this.id || decodeURIComponent(intent.query.id);

                getUser({user_id: id, include: 'photos,interests'}).then(response => {
                    this.user = response.data.user;
                    this.isLoading = false;
                })
            }
        },
        mounted() {
            if (this.hasVip) {
                return;
            }

            // profileInterstitial.load();
        },
        beforeDestroy(){
            if (this.$refs.content){
                this.$refs.content.removeEventListener('scroll', this.onScroll);
            }
        },
        hidePopupHandler() {
            if (_selfVM.hasVip || _selfVM.isMe) {
                return;
            }

            // if (profileInterstitial.shouldPresent()) {
            //     profileInterstitial.present();
            // }
        },
        watch: {
            user(newVal){
                if(newVal !== undefined && this.$refs.content){
                    this.$refs.content.addEventListener('scroll', this.onScroll);
                }
            }
        },
        methods: {
            likeAction() {
                // if (this.needUploadPhoto && this.viewedCardsAfterPhotoRequest >= this.numCardsBeforeRequestPhoto) {
                //     feed.showPhotoUpload(this.user);
                //     this.lockLikeAction();
                //
                //     return;
                // }

                feed.likeAction(this.user);

                this.$store.commit('feed/removeCardById', this.user.id);
                this.$nav.back();
            },
            dislikeAction() {
                // if (this.likeActionLocked) {
                //     this.unlockLikeAction();
                //     this.resetPhotoRequestCounter();
                // }

                feed.dislikeAction(this.user);

                this.$store.commit('feed/removeCardById', this.user.id);
                this.$nav.back();
            },
            getPhotoUrl(index) {
                return 'https://im0-tub-ru.yandex.net/i?id=aaa0c700a686125e286e3d2aac86fd91&n=33&w=225&h=150';
            },
            openPhoto(index) {
                let popup;

                this.$nav.pushInstant({
                    activate: animated => {
                        popup = photoviewer.open({
                            fetch: () => {
                                return new Promise(resolve => {
                                    let photos = [
                                        {
                                            id: 1,
                                            url: 'https://im0-tub-ru.yandex.net/i?id=aaa0c700a686125e286e3d2aac86fd91&n=33&w=225&h=150'
                                        },
                                        {
                                            id: 2,
                                            url: 'https://im0-tub-ru.yandex.net/i?id=aaa0c700a686125e286e3d2aac86fd91&n=33&w=225&h=150'
                                        },
                                        {
                                            id: 3,
                                            url: 'https://im0-tub-ru.yandex.net/i?id=aaa0c700a686125e286e3d2aac86fd91&n=33&w=225&h=150'
                                        }
                                    ];

                                    resolve(photos);
                                });
                            },
                            initialId: 0,
                            urlAlias: "url",
                            animated
                        });
                    },
                    unload: animated => {
                        photoviewer.close(popup, animated);
                    }
                });
            },
            complain() {
                feed.complain(this.user).then((response = {}) => {
                    if (response.success) {
                        feed.skipAction(this.user);
                        this.$nav.back();
                    }
                });
            },
            onScroll() {
                const wrapperHeight = this.$refs.content.clientHeight;
                const scrollHeight = this.$refs.content.scrollHeight;
                const scrollValue = this.$refs.content.scrollTop;

                this.actionCollapsed = scrollHeight - wrapperHeight - scrollValue < 20;
            },
            showOffer() {
                feed.showVipFullOffer({source: SOURCE_VIP_CHAT_REQUEST_LIMIT});
            },
            onSelectAction(id){
                this.isOpeningActionsTooltip = false;

                switch (id) {
                    case 1:
                        this.complain();

                        break;
                    case 2:
                        this.$toasted.show('ACTION FOR BLOCK');

                        break;
                }
            },
            ...mapMutations('feed', ['lockLikeAction', 'unlockLikeAction', 'resetPhotoRequestCounter'])
        }
    }
</script>
