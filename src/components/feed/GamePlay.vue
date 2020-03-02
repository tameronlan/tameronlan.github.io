<template>
    <div class="game-popup-play">
        <div class="game-popup__top">
            <div class="game-popup-header">
                <div class="game-popup-header__back" @click="$nav.back()">
                    <div class="ico ico_arrow-left-white-24"></div>
                </div>

                <div class="game-popup-header__user">
                    <div class="game-popup-header__name">Aleksandr</div>
                </div>
            </div>

            <div class="game-popup-play__sides">
                <div class="game-popup-play-side game-popup-play-side_my">
                    <div class="game-popup-play-side__ava"></div>
                    <div class="game-popup-play-side__content">
                        <div class="game-popup-play-side__name">name</div>
                        <div class="game-popup-play-side__score">
                            12000
                        </div>
                    </div>
                </div>

                <div class="game-popup-play-side game-popup-play-side_enemy">
                    <div class="game-popup-play-side__ava"></div>
                    <div class="game-popup-play-side__content">
                        <div class="game-popup-play-side__name">name</div>
                        <div class="game-popup-play-side__score game-popup-play-side__score_more">
                            12000
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="game-popup-play__middle">
            <div class="game-popup-play__circle game-popup-circle">
                <div class="game-popup-circle__ava" :style="{backgroundImage: `url()`}"></div>
                <div class="game-popup-circle__inline"><placeholder-game/></div>
                <div class="game-popup-circle__heart"><heart/></div>
                <div class="game-popup-circle-points">
                    <div class="game-popup-circle-points__new game-popup-circle-points__new_positive">+100</div>
                    <div class="game-popup-circle-points__new game-popup-circle-points__new_negative">-10</div>
                </div>
                <div class="game-popup-circle__timer">{{timeEndString}}</div>
            </div>
            <div class="game-popup-play-progress">
                <div class="game-popup-play-progress__line game-popup-play-progress__line_my">
                    <div class="game-popup-play-progress__ava"></div>
                </div>
                <div class="game-popup-play-progress__line game-popup-play-progress__line_my">
                    <div class="game-popup-play-progress__ava"></div>
                </div>
            </div>
        </div>

        <div class="game-popup-play__bottom">
            <div
                    class="game-popup-play__btn btn btn_orange ripple ripple_white"
                    @click="shoot"
                    v-touch
            >Попасть</div>
        </div>
    </div>
</template>

<script>
    import PlaceholderGame from '@/assets/svg/placeholder-game.svg';
    import Heart from '@/assets/svg/heart.svg';

    export default {
        name: "GamePlay",
        components: {PlaceholderGame, Heart},
        data(){
            return {
                timeEndGame: 600,
                shootCount: 0
            }
        },
        computed: {
            timeEndString(){
                let seconds = this.timeEndGame;
                let minutes = Math.floor(seconds / 60);

                seconds -= minutes*60;

                return `${minutes > 10 ? minutes : '0' + minutes}:${seconds > 10 ? seconds : '0' + seconds}`;
            }
        },
        mounted(){
            setInterval(()=> {
               this.timeEndGame--;
               this.checkEndGame();
            }, 1000)
        },
        methods: {
            shoot(){
                this.shootCount ++;

                if (this.shootCount > 10){
                   let rand = Math.floor(Math.random()*100);

                   this.$emit('gameFinal', {isWin: rand > 50});
                }
            },
            draw(){

            },
            drawAim(){

            },
            drawScores(){

            },
            checkEndGame(){
                if(this.timeEndGame < 0){
                    this.$emit('gameFinal', {isWin: false});
                }
            }
        }
    }
</script>

<style scoped>

</style>
