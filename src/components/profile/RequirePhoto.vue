<template>
    <button class="user-profile__require-photo btn_primary"
            :disabled="isUploading"
            v-file-upload="onFileChange" v-touch>
        <i class="ico ico_photos"></i> {{ requirePlaceholder }}
    </button>
</template>

<script>
    import {GENDER_MAN} from '../../consts';
    import photoUploader from '@/popups/photoUploader';
    import feed from '@/feed/';

    export default {
        name: 'RequirePhoto',
        props: ['user'],
        data() {
            return {
                isUploading: false,
            }
        },
        computed: {
            requirePlaceholder() {
                let isMan = this.user.gender === GENDER_MAN;
                let pronouns = isMan ? this.$t('personal_pronouns.him') : this.$t('personal_pronouns.her');
                return this.$t('user_profile.require_photo', {pronouns: pronouns});
            }
        },
        mounted() {
            this.$nativeStat.trackFirebaseEvent('item_action', {screen: 'Profile', action: 'Chat Photo Required'});
            this.$nativeStat.trackMetricaEvent('item_action', {'Profile': 'Chat Photo Required'});
            this.$nativeStat.trackAppsFlyerEvent('fs_action', {
                af_content_type: 'Profile',
                ap_action: 'Chat Photo Required'
            });
        },
        methods: {
            onFileChange(fileInput) {
                if (this.isUploading) {
                    return;
                }

                this.isUploading = true;

                photoUploader.uploadPhoto(fileInput, true).then(response => {
                    this.isUploading = false;
                    this.$nativeStat.trackCommonEvent('my_photo_upload', {source: 'Chat Photo Required'});
                    this.$nativeStat.trackAppsFlyerEvent('ap_my_photo_upload', {ap_source: 'Chat Photo Required'});
                }).catch((error) => {
                    this.isUploading = false;
                    feed.showUploadError();
                });
            }
        }
    }
</script>
