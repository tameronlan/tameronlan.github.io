<template>
    <div ref="image" class="photoviewer-slider__image" :style="{ backgroundImage: `url(${url})` }"></div>
</template>

<script>
    export default {
        props: ['photo', 'urlAlias'],
        computed: {
            url() {
                if (this.urlAlias) {
                    return this.photo[this.urlAlias];
                }

                return this.photo.url_l;
            } 
        }
    }
</script>
