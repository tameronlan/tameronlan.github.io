<template>
    <div class="real-photo">
        <div class="real-photo__head">
            <div class="real-photo__photo-wrap">
                <div class="real-photo__photo" :style="{backgroundImage: `url(${photoUrl})`}"></div>
            </div>
            <i class="ico ico_attention"></i>
        </div>
        <div class="real-photo__message">
            <i class="ico ico_camera"></i>
            {{$t('real_photo.msg')}}
        </div>
        <div class="real-photo__sub-title">{{$t('real_photo.subtitle')}}</div>
        <button class="btn_primary btn_size-m" :disabled="isUploading" v-file-upload="onFileChange" v-touch>{{$t('real_photo.btn_add')}}</button>
        <button class="real-photo__btn-back" @click="$nav.back()">{{$t('real_photo.btn_later')}}</button>
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
        name: "RealPhoto",
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
                return this.user.avatars.s1;
            }
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
                });
            }
        }
    }
</script>
