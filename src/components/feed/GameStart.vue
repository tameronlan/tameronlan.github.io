<template>
    <div class="game-popup-start">
        <div class="game-popup__top">
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
                <div class="game-popup-circle__ava" :style="{backgroundImage: `url(${aim.avatars.s5})`}"></div>
                <div class="game-popup-circle__inline"><placeholder-game/></div>
                <div class="game-popup-start__btn_start btn btn_turquoise" @click="$emit('playGame')">
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
    import feed from '@/feed/';

    export default {
        name: "GameStart",
        components: {PlaceholderGame},
        props: ['states', 'changeState', 'aim'],
        created() {
            // console.log(this.aim);
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
