<template>
    <div class="photo-gallery">
        <div v-if="photos.length > 0" class="photo-gallery__list">
            <div v-for="(item, index) in photos" class="photo-gallery__photo"
                 :key="item.id"
                 :class="{'photo-gallery__photo_main': item.is_avatar}"
                 :style="{backgroundImage: `url(${item.urls.s3})`}"
                 @click="openPhoto(index)"></div>
        </div>
        <div v-else class="photo-gallery__empty">
            <div class="photo-gallery__photo-slot" v-file-upload="onFileSelect">
                <i class="ico ico_plus-yellow"></i>
            </div>
            <div class="photo-gallery__message">
                <div>{{$t('photo_gallery.title')}}</div>
                <div>{{$t('photo_gallery.subtitle')}}</div>
            </div>
        </div>
        <div class="photo-gallery__actions">
            <button class="btn_secondary"
                    :disabled="isUploading || galleryIsFull"
                    v-touch
                    v-file-upload="onFileSelect"
            >{{$t('photo_gallery.btn_photo')}}
            </button>
        </div>
    </div>
</template>

<script>
    import photoUploader from '@/popups/photoUploader';
    import feed from '@/feed/';
    import photoviewer from '@/popups/photoviewer';

    export default {
        name: "PhotoGallery",
        props: ['photos', 'onUpdate'],
        data() {
            return {
                isUploading: false
            }
        },
        computed: {
            galleryIsFull() {
                return this.photos && this.photos.length >= 10;
            }
        },
        methods: {
            onFileSelect(fileInput) {
                if (this.isUploading) {
                    return;
                }

                this.isUploading = true;

                photoUploader.uploadPhoto(fileInput).then(response => {
                    let photos = response.objects;

                    this.isUploading = false;
                    this.onUpdateGallery(photos);
                }).catch((error) => {
                    this.isUploading = false;
                    feed.showUploadError();
                });
            },
            openPhoto(index) {
                let popup;
                let photo = this.photos[index];

                this.$nav.pushInstant({
                    activate: animated => {
                        popup = photoviewer.open({
                            fetch: () => {
                                return new Promise(resolve => {
                                    let photos = this.photos.map(item => {
                                        return {
                                            url: item.urls.o,
                                            ...item
                                        }
                                    });
                                    resolve(photos);
                                });
                            },
                            initialId: photo && photo.id,
                            urlAlias: "url",
                            onUpdate: this.onUpdateGallery,
                            editable: true,
                            animated
                        });
                    },
                    unload: animated => {
                        photoviewer.close(popup, animated);
                    }
                });
            },
            onUpdateGallery(gallery) {
                this.$emit('update', gallery);
            }
        }
    }
</script>
