<template>
    <div class="game-popup-start">
        <div class="game-popup__top game-popup__top_start">
            <div class="game-popup-header">
                <div class="game-popup-header__back" @click="$nav.back()">
                    <div class="ico ico_arrow-left-white-24"></div>
                </div>

                <div class="game-popup-header__name">name</div>
            </div>
        </div>

        <div class="game-popup-start__top">
            <div class="ico2 ico2_heart-game"></div>
            <div class="game-popup-start__info">
                Попади аватаркой девушки <br>
                в сердце и опереди соперника
            </div>
        </div>

        <div class="game-popup-start__middle">
            <div class="btn btn_yellow game-popup-start__btn" v-touch @click="$emit('playGame')">Начать игру</div>
        </div>

        <div class="game-popup-start__bottom">
            <div class="game-popup-start-booster">
                <div class="game-popup-start-booster__info">
                    <div class="game-popup-start-booster__title">Получи преимущество</div>
                    во время игры с <span>Premium</span>
                </div>
            </div>

            <div class="game-popup-start-booster__ico ico2 ico2_booster-promo-heart">
                +25
            </div>

            <div class="game-popup-start-booster__btn btn btn_purple" @click="openVipPopup">
                Получить бустер
                <span>+25 очков раз в 15 секунд</span>
            </div>
        </div>
    </div>
</template>

<script>
    import PlaceholderGame from '@/assets/svg/placeholder-game.svg';
    import DecorationTop from '@/assets/svg/decoration-top.svg';
    import feed from '@/feed/';
    import GameDecor from '@/components/game/GameDecor';

    export default {
        name: "game-start",
        components: {PlaceholderGame, DecorationTop, GameDecor},
        props: ['states', 'changeState', 'aim'],
        created() {},
        computed: {
            windowWidth(){
                return window.innerWidth;
            },
        },
        methods: {
            openVipPopup(){
                feed.showVipFullOffer()
            }
        }
    }
</script>
