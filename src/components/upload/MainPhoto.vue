<template>
    <div class="main-photo extend" :style="{backgroundImage: `url(${photoUrl})`}">
        <div class="main-photo__content">
            <div class="main-photo__message">
                <i class="ico ico_camera"></i>
                <span v-html="message"></span>
            </div>
            <div class="main-photo__buttons">
                <button class="main-photo__btn-back" @click="$nav.back()" v-html="$t('main_photo.bnt_later')"></button>
                <button class="btn_primary btn_size-m" :disabled="isUploading" v-file-upload="onFileChange" v-touch>
                    {{$t('main_photo.bnt_add')}}
                </button>
            </div>
        </div>
        <div v-if="isUploading" class="loader-wrap loader-wrap-extend loader-wrap_black">
            <loader :small="true"></loader>
        </div>
    </div>
</template>

<script>
    import {GENDER_MAN} from "../../consts";
    import photoUploader from '@/popups/photoUploader';
    import feed from '@/feed/';
    import Loader from '@/components/common/Loader';

    export default {
        name: 'MainPhoto',
        components: {Loader},
        props: ['card'],
        data() {
            return {
                user: this.$store.state.config.user,
                isUploading: false
            }
        },
        computed: {
            photoUrl() {
                return this.card.avatars.s5;
            },
            message() {
                return this.$t(this.isMan ? 'main_photo.msg_male' : 'main_photo.msg_female', {name: this.card.name});
            },
            isMan() {
                return this.$store.state.config.user.gender === GENDER_MAN;
            }
        },
        mounted() {
        },
        methods: {
            onFileChange(fileInput) {
                if (this.isUploading) {
                    return;
                }

                this.isUploading = true;

                photoUploader.uploadPhoto(fileInput, true).then(response => {
                    this.isUploading = false;
                    this.$nav.back();
                }).catch((error) => {
                    this.isUploading = false;
                    feed.showUploadError();
                })
            }
        }
    }
</script>
