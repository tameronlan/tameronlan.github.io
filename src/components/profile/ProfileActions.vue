<template>
    <div class="user-profile__actions">
        <template v-if="false">
            <button class="user-profile__btn btn btn_blue ripple ripple_white" @click="$emit('dislike')" v-touch>
                <span class="ico ico_crown"></span>
                Написать
            </button>

            <button class="user-profile__btn btn btn_turquoise ripple ripple_white" @click="$emit('like')" v-touch>
                Ухаживать
            </button>
        </template>

        <button v-else class="user-profile__btn btn btn_orange ripple ripple_white" @click="$emit('like')" v-touch>
            Показать ему меня
        </button>
    </div>
</template>

<script>

    export default {
        name: "ProfileActions",
    }
</script>
