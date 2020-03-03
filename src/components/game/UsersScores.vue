<template>
    <div class="game-popup-play__sides">
        <div
                class="game-popup-play-side game-popup-play-side_my"
                :class="{'game-popup-play-side_lose': myScore < enemyScore}"
        >
            <div class="game-popup-play-side__ava" :style="{backgroundImage: `url(${currentUser.avatars.s5})`}"></div>
            <div class="game-popup-play-side__content">
                <div class="game-popup-play-side__name">{{currentUser.name}}</div>
                <div class="game-popup-play-side__score" ref="myScore">
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
                <div class="game-popup-play-side__score" ref="enemyScore">
                    {{enemyScore}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: "users-scores",
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
            ...mapState(['currentUser'])
        },
        watch: {
            myScore(newVal, oldVal){
                let color = "#2CFFB3";

                if (newVal < oldVal){
                    color = "#FF689E";
                }

                this.$refs.myScore.style.color=color;
                this.$refs.myScore.style.transform="scale(1.5)";

                setTimeout(()=>{
                    this.$refs.myScore.style.color="#fff";
                    this.$refs.myScore.style.transform="scale(1)";
                }, 700);
            },
            enemyScore(newVal, oldVal){
                let color = "#2CFFB3";

                if (newVal < oldVal){
                    color = "#FF689E";
                }

                this.$refs.enemyScore.style.color=color;
                this.$refs.enemyScore.style.transform="scale(1.5)";

                setTimeout(()=>{
                    this.$refs.enemyScore.style.color="#fff";
                    this.$refs.enemyScore.style.transform="scale(1)";
                }, 700);
            }
        }
    }
</script>

