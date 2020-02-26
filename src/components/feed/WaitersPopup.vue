<template>
    <div class="waiters-popup__container">
        <div class="popup__back" @click="$nav.back()">
            <i class="ico ico_arrow-left-white-24"></i>
        </div>

        <div class="waiters-popup__top">
            <div class="waiters-popup-aim">
                <div class="waiters-popup-aim__user"></div>
            </div>

            <div class="waiters-popup__title ellipsis">
                Это лфвофрывлфрволфрволф
            </div>

            <div class="waiters-popup__text">
                Она захотела, чтобы вы обратили на нее внимание
            </div>

            <div class="waiters-popup-motivator">
                <div class="waiters-popup-motivator__ico ico ico_cards-blue"></div>
                <div class="waiters-popup-motivator__text">
                    <div class="waiters-popup-motivator__title">
                        Пролистайте 15 карточек
                    </div>
                    чтобы увидеть ее
                </div>
            </div>
        </div>
        <div class="waiters-popup__middle">
            <div class="waiters-popup-queue">
                <div class="waiters-popup-queue__line"></div>
                <div class="waiters-popup-queue__user"></div>
                <div class="waiters-popup-queue__user"></div>
                <div class="waiters-popup-queue__user"></div>
                <div class="waiters-popup-queue__user"></div>
            </div>

            <div class="waiters-popup__info">
                Больше 3 девушек ждут вашего внимания
            </div>
        </div>

        <div class="waiters-popup__bottom">
            <div class="waiters-popup__btn btn btn_orange" v-touch>
                {{$t('waiters.watch_all')}}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "waiters-popup",
        props: ['onClose']
    }
</script>
