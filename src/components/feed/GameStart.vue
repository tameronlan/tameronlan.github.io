<template>
    <div class="game-popup-start">
        <div class="game-popup__top">
            <game-decor
                    :width="windowWidth"
                    :height="26"
                    :fillColor="'#fff'"
            />

            <div class="game-popup-header">
                <div class="game-popup-header__back" @click="$nav.back()">
                    <div class="ico ico_arrow-left-white-24"></div>
                </div>

                <div class="game-popup-header__name">name</div>
            </div>

            <div class="game-popup-start__info">
                Опереди своего конкурента
                и получи шанс написать ей
                сообщение
            </div>
        </div>

        <div class="game-popup-start__middle">
            <div class="game-popup-circle">
                <div class="game-popup-circle__ava" :style="{backgroundImage: `url(${aim.avatars.s5})`, transform: `translateY(-102px)`}"></div>
                <div class="game-popup-circle__inline"><placeholder-game/></div>
                <div class="game-popup-start__btn_start btn btn_turquoise" @click="$emit('playGame')" v-touch>
                    Начать
                </div>
            </div>
        </div>

        <div class="game-popup-start__bottom">
            <div class="game-popup-start__btn btn btn_purple" @click="openVipPopup">
                Добавить в игру бустера
                <span>+25 очков раз в 15 секунд</span>
            </div>
        </div>
    </div>
</template>

<script>
    import PlaceholderGame from '@/assets/svg/placeholder-game.svg';
    import DecorationTop from '@/assets/svg/decoration-top.svg';
    import feed from '@/feed/';
    import GameDecor from '@/components/feed/GameDecor';

    export default {
        name: "GameStart",
        components: {PlaceholderGame, DecorationTop, GameDecor},
        props: ['states', 'changeState', 'aim'],
        created() {
            // console.log(this.aim);
        },
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

<style scoped>

</style>
