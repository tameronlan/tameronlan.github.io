<template>
    <div class="topbar-container topbar-container_black">
        <div class="topbar-container__header topbar topbar_opaque">
            <div class="topbar__action ripple ripple_white" v-touch @click="$nav.back()">
                <i class="ico ico_arrow-left-white-24"></i>
            </div>
            <div class="topbar__title">
                {{ title }}
            </div>
            <div v-if="editable" class="topbar__button" @click="isOpeningDialog = !isOpeningDialog">
                <i class="ico2 ico2_menu"></i>
            </div>
        </div>

        <div v-if="isLoading" class="topbar-container__content">
            <div class="topbar-container__content-loader">
                <loader color="white" bg="black"></loader>
            </div>
        </div>

        <div v-else class="topbar-container__content photoviewer">
            <div class="photoviewer__slider photoviewer-slider" ref="slider">
                <div class="photoviewer-slider__item" ref="slide1">
                    <photo v-if="photo1" :photo="photo1" :urlAlias="urlAlias"></photo>
                </div>
                <div class="photoviewer-slider__item" ref="slide2">
                    <photo v-if="photo2" :photo="photo2" :urlAlias="urlAlias"></photo>
                </div>
                <div class="photoviewer-slider__item" ref="slide3">
                    <photo v-if="photo3" :photo="photo3" :urlAlias="urlAlias"></photo>
                </div>
            </div>
            <div v-if="user" class="photoviewer__buttombar">

            </div>
        </div>
        <action-dialog v-if="isOpeningDialog"
                       :actions="currentPhotoActions"
                       @close="isOpeningDialog = false"
                       @select="onSelectAction"/>
        <div v-if="isUploading" :style="{'z-index': 11}" class="loader-wrap loader-wrap-inside">
            <loader/>
        </div>
    </div>
</template>

<script>
    import photoUploader from '@/popups/photoUploader';
    import Slider from '@/lib/slider/Slider';
    import SliderDataSourceSet from '@/lib/slider/SliderDataSourceSet';
    import Photo from './Photo';
    import Loader from '@/components/Loader';
    import ActionDialog from '../ActionsDialog';
    import feed from '@/feed/';
    import {setAvatar, photoDelete} from '../../api/profile';

    const ACTION_ADD = 1;
    const ACTION_SET_MAIN = 2;
    const ACTION_REMOVE = 3;

    export default {
        props: ['fetch', 'initialId', 'user', 'urlAlias', 'onUpdate', 'editable'],
        components: {Photo, Loader, ActionDialog},
        data() {
            return {
                isLoading: true,
                isUploading: false,
                photos: null,
                sliderDs: null,
                slider: null,
                photo1: null,
                photo2: null,
                photo3: null,
                activePhoto: null,
                swipedOnce: false,
                isOpeningChat: false,
                isOpeningDialog: false
            };
        },
        computed: {
            title() {
                if (!this.photos || !this.activePhoto) {
                    return null;
                }

                for (var i = 0; i < this.photos.length; i++) {
                    if (this.photos[i] === this.activePhoto) {
                        return `${i + 1} из ${this.photos.length}`;
                    }
                }

                return null;
            },
            currentPhotoActions() {
                let actions = [{
                    label: this.$t('photo_viewer.btn_add'),
                    id: ACTION_ADD,
                    fileUpload: this.onUploadAction
                }];

                console.log('this.activePhoto', this.activePhoto);

                if (this.activePhoto.can_set_avatar && !this.activePhoto.is_avatar) {
                    actions.push({label: this.$t('photo_viewer.btn_main'), id: ACTION_SET_MAIN});
                }

                if (this.activePhoto.can_delete) {
                    actions.push({label: this.$t('photo_viewer.btn_delete'), id: ACTION_REMOVE});
                }

                return actions;
            }
        },
        mounted() {
            this.isLoading = true;
            this.fetch().then(photos => {
                this.isLoading = false;
                this.$nextTick(() => {
                    this.photos = photos;
                    this.sliderDs = new SliderDataSourceSet({
                        items: photos,
                        initialId: this.initialId
                    });
                    this.slider = new Slider({
                        dataSource: this.sliderDs,
                        el: this.$refs.slider,
                        cardElPrev: this.$refs.slide1,
                        cardElCenter: this.$refs.slide2,
                        cardElNext: this.$refs.slide3,
                        swapObjectInWrapper: this.swapPhoto,
                        didMoveTo: this.didMoveTo,
                        willMoveTo: () => {
                        },
                        onSwipeNext: this.onSwipeNext
                    });
                });
            });
        },
        methods: {
            swapPhoto(targetWrapper, model, position) {
                if (targetWrapper === this.$refs.slide1) {
                    this.photo1 = model;
                } else if (targetWrapper === this.$refs.slide2) {
                    this.photo2 = model;
                } else if (targetWrapper === this.$refs.slide3) {
                    this.photo3 = model;
                }
            },
            didMoveTo({to}) {
                this.activePhoto = to;
            },
            onSwipeNext() {
                if (this.swipedOnce) {
                    return;
                }

                this.swipedOnce = true;
            },
            openChat() {

            },
            openProfile() {

            },
            onSelectAction(id) {
                this.isOpeningDialog = false;
                this.isUploading = true;

                switch (id) {
                    case ACTION_SET_MAIN:
                        setAvatar({photo_id: this.activePhoto.id}).then(response => {
                            let photos = response.objects;
                            this.completeAction(photos);
                        }).finally(() => {
                            this.isUploading = false;
                        });
                        break;
                    case ACTION_REMOVE:
                        photoDelete({photo_id: this.activePhoto.id}).then(response => {
                            let photos = response.objects;
                            this.completeAction(photos);
                        }).finally(() => {
                            this.isUploading = false;
                        });
                        break;
                }
            },
            onUploadAction(fileInput) {
                this.isOpeningDialog = false;
                this.isUploading = true;

                photoUploader.uploadPhoto(fileInput).then(response => {
                    let photos = response.objects;
                    this.completeAction(photos);
                }).catch((error) => {
                    feed.showUploadError();
                }).finally(() => {
                    this.isUploading = false;
                });
            },
            completeAction(gallery) {
                if (this.onUpdate) {
                    this.onUpdate(gallery);
                }

                this.$nav.back();
            }
        }
    };
</script>
