<template>
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
                // console.log(newVal, oldVal);
            },
            enemyScore(newVal, oldVal){
                // console.log(newVal, oldVal);
            }
        }
    }
</script>

