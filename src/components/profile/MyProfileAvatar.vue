<template>
    <div class="my-profile-avatar" :style="avatarStyles">
        <div
            v-if="hasMainPhoto"
            class="my-profile-avatar__uploader my-profile-avatar__uploader_mini ripple ripple_white"
            v-touch
            @click="uploaderOpen"
        >
            <div class="ico ico_photo-add-small"></div>
        </div>
        <div
            v-else
            class="my-profile-avatar__uploader my-profile-avatar__uploader_big ripple ripple_white"
            v-touch
            @click="uploaderOpen"
        >
            <div class="ico ico_photo-add-big"></div>
            <div class="my-profile-avatar__text">
                Добавить фото
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "my-profile-avatar",
        data() {
            return {
                isLoadingStatus: false,
                hasMainPhoto: true
            }
        },
        computed: {
            avatarStyles() {
                return this.hasMainPhoto ? {
                    backgroundImage: `url(https://avatars.mds.yandex.net/get-pdb/27625/3d12982b-61d2-4458-b5e0-f8cbe4db85cc/s1200)`
                } : {}
            },
            uploaderClass(){
                let classes = ['my-profile-avatar__uploader'];

                if (!this.hasMainPhoto){
                    classes.push('my-profile-avatar__uploader_big');
                } else {
                    classes.push('my-profile-avatar__uploader_mini');
                }

                return classes;
            },
        },
        methods: {
            uploaderOpen(){
                console.log('uploader open');
            }
        }
    }
</script>
