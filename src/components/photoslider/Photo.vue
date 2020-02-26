<template>
    <div class="photo-slider__slide-content slide-item-photo" :style="{backgroundImage: `url(${url})`}"></div>
</template>

<script>
    export default {
        name: "Photo",
        props: ['content'],
        computed: {
            url() {
                return this.content.photo.url_360x640;
            }
        }
    }
</script>