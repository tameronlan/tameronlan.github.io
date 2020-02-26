<template>
    <div class="chat-photo-block">
        <div class="chat-photo-block__ava" :style="{ backgroundImage: `url(${avaSrc})` }"></div>
        <div class="chat-photo-block__title" v-html="title"></div>
        <button class="btn_primary btn_size-m btn_mw220" :disabled="isUploading" v-file-upload="onFileChange" v-touch>
            {{$t('chat_photo_block.btn')}}
        </button>
        <div v-if="isUploading" class="loader-wrap loader-wrap-extend loader-wrap_black">
            <loader :small="true"></loader>
        </div>
    </div>
</template>

<script>
    import {GENDER_MAN} from "@/consts";
    import photoUploader from '@/popups/photoUploader';
    import feed from '@/feed/';
    import Loader from '@/components/Loader';

    export default {
        name: 'ChatPhotoBlock',
        components: {Loader},
        props: ['contact'],
        data() {
            return {
                isUploading: false
            }
        },
        computed: {
            avaSrc() {
                return this.contact.user.avatars.s4;
            },
            title() {
                let isMan = this.contact.user.gender === GENDER_MAN;
                let pronouns = isMan ? this.$t('personal_pronouns.him') : this.$t('personal_pronouns.her');
                return this.$t('chat_photo_block.title', {pronouns: pronouns});
            }
        },
        mounted() {
            this.$nativeStat.trackFirebaseEvent('item_action', {screen: 'Chat Photo Required', action: 'View'});
            this.$nativeStat.trackMetricaEvent('item_action', {'Chat Photo Required': 'View'});
            this.$nativeStat.trackAppsFlyerEvent('fs_action', {
                af_content_type: 'Chat Photo Required',
                ap_action: 'View'
            });

            this.$nativeStat.trackCommonEvent('chat_photo_required');
            this.$nativeStat.trackAppsFlyerEvent('ap_chat_photo_required');
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
