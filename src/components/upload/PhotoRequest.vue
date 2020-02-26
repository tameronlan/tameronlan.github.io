<template>
    <div class="photo-request extend" :class="countryClass">
        <div class="photo-request__couple"></div>
        <div class="photo-request__extra">
            <div class="photo-request__title">{{$t('photo_request.title')}}</div>
            <div class="photo-request__subtitle">{{$t('photo_request.subtitle')}}</div>
            <button class="btn_primary btn_size-m btn_mw240" :disabled="isUploading" v-file-upload="onFileChange"
                    v-touch>{{$t('photo_request.btn')}}
            </button>
        </div>
        <div class="extend__close" @click="$nav.back()"><i class="ico ico_exit-gray"></i></div>
        <div v-if="isUploading" class="loader-wrap loader-wrap-extend loader-wrap_black">
            <loader :small="true"></loader>
        </div>
    </div>
</template>

<script>
    import photoUploader from '@/popups/photoUploader';
    import feed from '@/feed/';
    import Loader from '@/components/Loader';

    export default {
        name: 'PhotoRequest',
        components: {Loader},
        data() {
            return {
                isUploading: false
            }
        },
        computed: {
            countryClass() {
                return `country_${this.$store.state.config.country}`;
            }
        },
        mounted() {
            this.$nativeStat.trackFirebaseEvent('item_action', {screen: 'Add Photo', action: 'View'});
            this.$nativeStat.trackMetricaEvent('item_action', {'Add Photo': 'View'});
            this.$nativeStat.trackAppsFlyerEvent('fs_action', {af_content_type: 'Add Photo', ap_action: 'View'});
        },
        methods: {
            onFileChange(fileInput) {
                if (this.isUploading) {
                    return;
                }

                this.isUploading = true;

                photoUploader.uploadPhoto(fileInput, true).then(response => {
                    this.isUploading = false;
                    this.$nativeStat.trackCommonEvent('my_photo_upload', {source: 'Add Photo'});
                    this.$nativeStat.trackAppsFlyerEvent('ap_my_photo_upload', {ap_source: 'Add Photo'});
                    this.$nav.back();
                }).catch((error) => {
                    this.isUploading = false;
                    feed.showUploadError();
                });
            }
        }
    }
</script>
