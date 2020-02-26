<template>
    <div class="card-actions">
        <button class="card-actions__btn card-actions__btn_no ignore-form" @click="$emit('dislike')" v-touch>
            <span class="card-actions__ico"><dislike-icon/></span>
        </button>

        <button v-if="0" class="btn btn_orange card-actions__btn card-actions__btn_text card-actions__btn_showme ignore-form" @click="$emit('like')" v-touch>
            {{$t('card.show_me')}}
        </button>

        <button v-else class="btn btn_turquoise card-actions__btn card-actions__btn_text card-actions__btn_care ignore-form" @click="$emit('like')" v-touch>
            {{$t('card.care')}}
        </button>
    </div>
</template>

<script>
    import DislikeIcon from '@/assets/svg/action_dislike.svg';

    export default {
        name: "CardActions",
        components: {DislikeIcon}
    }
</script>
