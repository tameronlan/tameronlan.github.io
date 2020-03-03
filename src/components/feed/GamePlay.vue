<template>
    <div class="game-popup-play">
        <div
                class="game-popup-countdown"
                :class="{'game-popup-countdown_hidden': timeToStart <= 0}"
        >
            До старта игры:
            <div class="game-popup-countdown__digit">
                {{timeToStart}}
            </div>
        </div>

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

                <div class="game-popup-header__user">
                    <div class="game-popup-header__name">Aleksandr</div>
                </div>
            </div>

            <div class="game-popup-play__sides">
                <div
                        class="game-popup-play-side game-popup-play-side_my"
                        :class="{'game-popup-play-side_lose': myScore < enemyScore}"
                >
                    <div class="game-popup-play-side__ava" :style="{backgroundImage: `url(${currentUser.avatars.s5})`}"></div>
                    <div class="game-popup-play-side__content">
                        <div class="game-popup-play-side__name">{{currentUser.name}}</div>
                        <div class="game-popup-play-side__score">
                            {{myScore}}
                        </div>
                    </div>
                </div>

                <div
                        class="game-popup-play-side game-popup-play-side_enemy"
                        :class="{'game-popup-play-side_lose': myScore > enemyScore}"
                >
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
            <div class="game-popup-play__circle">
                <div class=" game-popup-circle" :style="transformCircleStyles">
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
                    <div
                            class="game-popup-circle__timer"
                            :class="{'game-popup-circle__timer': gameEndIsNear}"
                    >
                        {{timeEndString}}
                    </div>
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
                    </div>
                </div>
            </div>

            <div class="game-popup-play-progress">
                <div class="game-popup-play-progress__line">
                    <div class="game-popup-play-progress__ava" :style="progressStyles.my"></div>
                    <div class="game-popup-play-progress__ava" :style="progressStyles.enemy"></div>
                </div>
            </div>

            <div class="game-popup-play-booster"
                    :class="{'game-popup-play-booster_disabled': (boosterSecondsFromLastUsedTime < boosterRecoveryTime)}"
            >
                <div class="game-popup-play-booster__circle" v-touch @click="activeBooster">
                    <circle-progress
                            ref="boosterCircleProgress"
                            :diameter="72"
                            :percent="100"
                            :strokeWidth="8"
                            :strokeFill="`#FFC960`"
                            :strokeFillBg="`#CA68EC`"
                    />

                    <div class="game-popup-play-booster__btn">
                        <div class="ico2 ico2_booster-heart"></div>
                        <div class="game-popup-play-booster__points"></div>
                    </div>
                </div>

                <div v-if="boosterSecondsFromLastUsedTime < boosterRecoveryTime" class="game-popup-play-booster__title">
                    {{boosterRecoveryTime - boosterSecondsFromLastUsedTime}} сек
                </div>

                <div v-else class="game-popup-play-booster__title">Бустер</div>
            </div>

            <div class="game-popup-play__bottom">
                <div
                        class="game-popup-play__btn btn btn_orange ripple ripple_white"
                        :class="{'game-popup-play__btn_disabled' : !gameIsRun}"
                        @mousedown="shoot"
                        @touchstart="shoot"
                        v-touch
                >Попасть</div>
            </div>
        </div>
    </div>
</template>

<script>
    import PlaceholderGame from '@/assets/svg/placeholder-game.svg';
    import Heart from '@/assets/svg/heart.svg';
    import DecorationTop from '@/assets/svg/decoration-top.svg';
    import {mapState} from 'vuex';
    import GameDecor from '@/components/feed/GameDecor';
    import CircleProgress from '@/components/common/CircleProgress';

    export default {
        name: "GamePlay",
        components: {
            CircleProgress,
            PlaceholderGame, Heart, DecorationTop, GameDecor},
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
                pointsForAnimation: [],
                boosterAvailable: true,
                boosterPoints: 25,
                boosterRecoveryTime: 25,
                boosterSecondsFromLastUsedTime: 25,
            }
        },
        props: ['enemy'],
        computed: {
            windowWidth(){
                return window.innerWidth;
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
            progressStyles() {
                let maxDelta = 100;
                let topPercent = 0;
                let delta = 0;
                let my = { backgroundImage: `url(${this.currentUser.avatars.s5})`};
                let enemy = { backgroundImage: `url(${this.enemy.user.avatars.s5})`};

                if (this.myScore === this.enemyScore){
                    my.left = `-10px`;
                    enemy.left = `10px`;
                }

                if (this.myScore !== this.enemyScore){
                    delta = Math.abs(this.myScore - this.enemyScore);

                    delta = delta > maxDelta ? maxDelta : delta;

                    topPercent = (maxDelta - delta) * 100 / maxDelta;

                    if (this.myScore > this.enemyScore){
                        my.top = `${topPercent}%`;
                        enemy.top = `100%`;
                    } else {
                        my.top = `100%`;
                        enemy.top = `${topPercent}%`;
                    }
                }

                return {my, enemy}
            },
            gameEndIsNear(){
                return this.timeEndGame <= 5;
            },
            transformCircleStyles(){
                let paddings = 180;
                let scale = (this.windowWidth - paddings) / (2 * this.radius);

                scale = scale > 2 ? 2 : scale;

                return {
                    transform: `scale(${scale})`
                }
            },
            ...mapState(['currentUser'])
        },
        mounted(){
            setInterval(()=> {
                if (this.timeToStart > 0){
                    this.decrementTimeForStart();
                } else {
                    this.decrementTimeForEnd();
                }
            }, 1000);
        },
        destroyed(){
            if (this.requestId){
                window.cancelAnimationFrame(this.requestId);
            }
        },
        methods: {
            decrementTimeForStart(){
                this.timeToStart--;

                if (this.timeToStart === 0) {
                    this.gameIsRun = true;
                    this.startGame();
                }
            },
            startGame(){
                this.draw();
            },
            decrementTimeForEnd(){
                this.timeEndGame--;
                this.boosterSecondsFromLastUsedTime++;

                this.checkEndGame();
            },
            shoot(){
                if (!this.gameIsRun){
                    return;
                }

                this.pauseGame();
                this.animateShoowPoints().then(()=>{
                    this.updateAngleIn();
                    this.resumeGame();
                });
            },
            activeBooster(){
                if (this.boosterSecondsFromLastUsedTime < this.boosterRecoveryTime){
                    return;
                }

                this.animatePoints(this.boosterPoints);
                this.boosterSecondsFromLastUsedTime = 0;
            },
            updateAngleIn(){
                let minAngle = this.deltaStartAngle + this.angleIn / 2;
                let maxAngle = 360 + this.deltaStartAngle - this.angleIn / 2;

                this.currentAimAngle = Math.floor(Math.random() * (maxAngle - minAngle + 1)) + minAngle;
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

                if (this.lastDrawTimestamp === 0) this.lastDrawTimestamp = currentTime;

                delta = currentTime - this.lastDrawTimestamp;

                this.timeInGame += delta;
                this.lastDrawTimestamp = currentTime;

                this.drawAim();
                this.drawScores();

                this.requestId = window.requestAnimationFrame(this.draw);
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
            animateShoowPoints(){
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
                    pointsAdded =  10;

                    this.speedMultiple *= 1.2;
                } else {
                    pointsAdded = -5;
                }

                return this.animatePoints(pointsAdded);
            },
            animatePoints(pointsAdded){
                this.myScore = this.myScore + pointsAdded < 0 ? 0 : this.myScore + pointsAdded;

                return new Promise((resolve) => {
                    this.pointsForAnimation.push(pointsAdded);

                    setTimeout(()=>{
                        resolve();

                        this.pointsForAnimation.shift();
                    }, 1000);
                });
            }
        },
        watch: {
            boosterSecondsFromLastUsedTime(newVal){
                let percent = newVal * 100/ this.boosterRecoveryTime;

                percent = percent >= 100 ? 100 : percent;

                this.$refs.boosterCircleProgress.updatePercent(percent);
            }
        }
    }
</script>

<style scoped>

</style>
