<template>
    <div class="cards">
        <div class="cards__list">
            <div class="card-item card-item__is-current">
                <div class="empty-feed">
                    <div class="empty-feed__title" v-html="title"></div>
                    <div class="empty-feed__message" v-html="$t('empty_feed.msg')"></div>
                </div>
            </div>
            <div class="card-item"></div>
            <div class="card-item"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'EmptyFeed',
        computed:{
            title(){
                return this.$t('empty_feed.title', {search_gender: this.$t('search_gender_female')});
            }
        }
    }
</script>
