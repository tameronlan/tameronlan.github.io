<template>
    <div class="mutual-item">
        <div class="mutual-item__photo-wrap">
            <div class="mutual-item__photo" :style="{backgroundImage: `url(${photoUrl})`}"></div>
            <div v-if="item.new > 0" class="mutual-item__count">{{item.new | counterLimit}}</div>
            <div v-else-if="!item.is_read" class="mutual-item__new"></div>
        </div>
        <div class="mutual-item__title ellipsis" v-html="item.user.name"></div>
    </div>
</template>

<script>
    export default {
        name: "MutualItem",
        props: ['item'],
        computed: {
            photoUrl() {
                return this.item.user.avatars.s2;
            }
        }
    }
</script>
