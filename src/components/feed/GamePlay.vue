<template>
    <div class="game-popup-play">
        <div class="game-popup-countdown" :class="{'game-popup-countdown_hidden': timeToStart <= 0}">
            До старта игры:
            <div class="game-popup-countdown__digit">
                {{timeToStart}}
            </div>
        </div>
        <div class="game-popup__top">
            <game-decor
                    :width="windowWidth"
                    :height="40"
                    :fillColor="'#fff'"
            />

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
                    <div class="game-popup-play-side__ava" :style="{backgroundImage: `url(${currentUser.avatars.s5})`}"></div>
                    <div class="game-popup-play-side__content">
                        <div class="game-popup-play-side__name">{{currentUser.name}}</div>
                        <div class="game-popup-play-side__score">
                            {{myScore}}
                        </div>
                    </div>
                </div>

                <div class="game-popup-play-side game-popup-play-side_enemy">
                    <div class="game-popup-play-side__ava" :style="{backgroundImage: `url(${enemy.user.avatars.s5})`}"></div>
                    <div class="game-popup-play-side__content">
                        <div class="game-popup-play-side__name">{{enemy.user.name}}</div>
                        <div class="game-popup-play-side__score">
                            {{enemyScore}}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="game-popup-play__middle">
            <div class="game-popup-play__circle game-popup-circle">
                <div class="game-popup-circle__ava" :style="{ transform: transformUserAva }"></div>
                <div class="game-popup-circle__inline" :style="{ transform: transformInline }">
                    <div
                            class="game-popup-circle__heart"
                            :class="{'game-popup-circle__heart_animated' : gameIsRun}"
                    >
                        <heart/>
                    </div>
                    <placeholder-game/>
                </div>
                <div class="game-popup-circle__timer">{{timeEndString}}</div>
                <div class="game-popup-circle-points">
                    <template v-for="point in pointsForAnimation">
                        <div
                                class="game-popup-circle-points__count"
                                :class="point > 0 ? 'game-popup-circle-points__count_positive' : 'game-popup-circle-points__count_negative'"
                        >
                            <div class="game-popup-circle-points__layer_1"></div>
                            <div class="game-popup-circle-points__layer_2"></div>
                            <div class="game-popup-circle-points__layer_3">
                                {{point}}
                            </div>
                        </div>
                    </template>
                    <!--<div class="game-popup-circle-points__new game-popup-circle-points__new_negative">-10</div>-->
                </div>
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
                    @mousedown="shoot"
                    @touchstart="shoot"
                    v-touch
            >Попасть</div>
        </div>
    </div>
</template>

<script>
    import PlaceholderGame from '@/assets/svg/placeholder-game.svg';
    import Heart from '@/assets/svg/heart.svg';
    import DecorationTop from '@/assets/svg/decoration-top.svg';
    import {mapState} from 'vuex';
    import GameDecor from '@/components/feed/GameDecor';

    export default {
        name: "GamePlay",
        components: {PlaceholderGame, Heart, DecorationTop, GameDecor},
        data(){
            return {
                gameIsRun: false,
                requestId: null,
                currentAvaRadian: 0,
                deltaStartAngle: 90, // угол сдвига координат, так как системы отсчёта для аватарки и сектора разные
                currentAimAngle: 360, // на такой угол повёрнут сектор
                angleIn: 56, // угол действия сектора
                timeEndGame: 600,
                timeToStart: 3,
                timeInGame: 0,
                lastDrawTimestamp: 0,
                deltaRadian: 0.04,
                speedMultiple: 1.1,
                radius: 100,
                myScore: 0,
                enemyScore: 0,
                pointsForAnimation: []
            }
        },
        props: ['enemy'],
        computed: {
            windowWidth(){
                return window.outerWidth;
            },
            timeEndString(){
                let seconds = this.timeEndGame;
                let minutes = Math.floor(seconds / 60);

                seconds -= minutes*60;

                return `${minutes >= 10 ? minutes : '0' + minutes}:${seconds >= 10 ? seconds : '0' + seconds}`;
            },
            transformUserAva() {
                let vx = Math.cos(this.currentAvaRadian) * this.radius;
                let vy = Math.sin(this.currentAvaRadian) * this.radius;

                return `translateY(${vy}px) translateX(${vx}px)`;
            },
            transformInline() {
                return `rotate(${this.currentAimAngle}deg)`;
            },
            ...mapState(['currentUser'])
        },
        mounted(){
            setInterval(()=> {
                if (this.timeToStart > 0){
                    this.timeToStart--;

                    if (this.timeToStart === 0) {
                        this.gameIsRun = true;
                        this.startGame();
                    }
                } else {
                    this.timeEndGame--;
                }

                this.checkEndGame();
            }, 1000);
        },
        destroyed(){
            if (this.requestId){
                window.cancelAnimationFrame(this.requestId);
            }
        },
        methods: {
            startGame(){
                this.draw();
            },
            shoot(){
                if (!this.gameIsRun){
                    return;
                }

                this.pauseGame();

                this.animatePoints().then(()=>{
                    let minAngle = this.deltaStartAngle + this.angleIn / 2;
                    let maxAngle = 360 + this.deltaStartAngle - this.angleIn / 2;

                    this.currentAimAngle = Math.floor(Math.random() * (maxAngle - minAngle + 1)) + minAngle;

                    this.resumeGame();
                });
            },
            pauseGame(){
                this.gameIsRun = false;
            },
            resumeGame(){
                this.gameIsRun = true;
                this.lastDrawTimestamp = +new Date();

                this.draw();
            },
            checkEndGame(){
                if(this.timeEndGame < 0){
                    this.$emit('gameFinal', { isWin: this.myScore >= this.enemyScore });
                }
            },
            draw(){
                if ( !this.gameIsRun ){
                    return;
                }

                let currentTime = +new Date();
                let delta = 0;

                if (this.lastDrawTimestamp === 0){
                    this.lastDrawTimestamp = currentTime;
                }

                this.drawAim();
                this.drawScores();

                delta = currentTime - this.lastDrawTimestamp;

                this.timeInGame += delta;
                this.lastDrawTimestamp = currentTime;

                this.requestId = window.requestAnimationFrame(() => {
                    this.draw();
                });
            },
            drawAim(){
                this.currentAvaRadian += this.deltaRadian * this.speedMultiple;
            },
            drawScores(){
                let secondsInGame = this.timeInGame / 1000;
                let maxKey = false;

                for (let seconds in this.enemy.timeLine){
                    if (seconds > secondsInGame ){
                        break;
                    } else {
                        maxKey = seconds;
                    }
                }

                this.enemyScore = maxKey ? this.enemy.timeLine[maxKey] : 0;
            },
            animatePoints(){
                let circleRadian = 2 * Math.PI;
                let circles = Math.floor(this.currentAvaRadian / circleRadian);
                let normalizeRadian = this.currentAvaRadian - circles * circleRadian;
                let positionAvaAngle = normalizeRadian * 180 / Math.PI;
                let currentInAngle = this.currentAimAngle - this.deltaStartAngle;
                let pointsAdded = 0;

                if (
                    positionAvaAngle >= currentInAngle - this.angleIn / 2
                    && positionAvaAngle <= currentInAngle + this.angleIn / 2
                ){
                    pointsAdded = 25;

                    this.speedMultiple *= 1.2;
                } else {
                    pointsAdded = -10;
                }

                this.myScore = this.myScore + pointsAdded < 0 ? 0 : this.myScore + pointsAdded;

                return new Promise((resolve) => {
                    this.pointsForAnimation.push(pointsAdded);

                    setTimeout(resolve, 1000);
                });
            }
        }
    }
</script>

<style scoped>

</style>
