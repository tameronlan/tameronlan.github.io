<template>
    <div class="banner-request-photo">
        <div class="banner-request-photo__wrap">
            <div>{{$t('banner_photo.title')}}</div>
            <button class="btn_white btn_size-m" :disabled="isUploading" v-file-upload="onFileChange" v-touch>
                {{$t('banner_photo.btn')}}
            </button>
        </div>
        <div v-if="isFirstTime" class="banner-request-photo__icons">
            <i class="ico ico_face-winking"></i>
            <i class="ico ico_face-winking"></i>
            <i class="ico ico_face-winking"></i>
        </div>
        <div v-if="isUploading" class="loader-wrap loader-wrap-extend loader-wrap_black">
            <loader :small="true"></loader>
        </div>
    </div>
</template>

<script>
    import {GENDER_FS_MAN} from "@/consts";
    import photoUploader from '@/popups/photoUploader';
    import feed from '@/feed/';
    import Loader from '@/components/Loader';

    export default {
        name: 'BannerRequestPhoto',
        components: {Loader},
        data() {
            return {
                isUploading: false
            }
        },
        computed: {
            isFirstTime() {
                let key = `serious_profile_preq`;
                return !localStorage.getItem(key);
            }
        },
        mounted() {
            let key = `serious_profile_preq`;
            localStorage.setItem(key, '1');

            this.$nativeStat.trackFirebaseEvent('item_action', {screen: 'My Profile', action: 'Add Photo'});
            this.$nativeStat.trackMetricaEvent('item_action', {'My Profile': 'Add Photo'});
            this.$nativeStat.trackAppsFlyerEvent('fs_action', {af_content_type: 'My Profile', ap_action: 'Add Photo'});
        },
        methods: {
            onFileChange(fileInput) {
                if (this.isUploading) {
                    return;
                }

                this.isUploading = true;

                photoUploader.uploadPhoto(fileInput, true).then(response => {
                    this.isUploading = false;
                    this.$nativeStat.trackCommonEvent('my_photo_upload', {source: 'My Profile'});
                    this.$nativeStat.trackAppsFlyerEvent('ap_my_photo_upload', {ap_source: 'My Profile'});
                }).catch((error) => {
                    this.isUploading = false;
                    feed.showUploadError();
                });
            }
        }
    }
</script>
