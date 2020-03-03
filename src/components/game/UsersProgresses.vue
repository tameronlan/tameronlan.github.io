<template>
    <div class="game-popup-play-progress">
        <div class="game-popup-play-progress__line">
            <div class="game-popup-play-progress__ava" :style="progressStyles.my"></div>
            <div class="game-popup-play-progress__ava" :style="progressStyles.enemy"></div>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: "users-progresses",
        props: {
            myScore: {
                type: Number,
                default: 0
            },
            enemyScore: {
                type: Number,
                default: 0
            },
            enemy: {
                type: Object,
                default: {}
            }
        },
        computed: {
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
            ...mapState(['currentUser'])
        }
    }
</script>