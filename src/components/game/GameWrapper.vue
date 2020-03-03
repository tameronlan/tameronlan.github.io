<template>
    <div class="game-popup" ref="gamePopup">
        <template v-if="state===states.GAME_STATE_START">
            <game-start
                    :states="states"
                    :aim="aim"
                    @playGame="playGame"
            />
        </template>
        <template v-if="state===states.GAME_STATE_PLAY">
            <game-play
                    :states="states"
                    :enemy="enemy"
                    @gameFinal="gameFinal"
            />
        </template>
        <template v-if="state===states.GAME_STATE_WIN">
            <game-final
                    :states="states"
            />
        </template>
    </div>
</template>

<script>
    import GameStart from './GameStart';
    import GamePlay from './GamePlay';
    import GameFinal from './GameFinal';
    import {GAME_STATE_START, GAME_STATE_PLAY, GAME_STATE_FINAL} from '../../consts';

    export default {
        name: "game-wrapper",
        components: {GameStart, GamePlay, GameFinal},
        props: ['card'],
        data(){
            return {
                state: null,
                aim: {},
                enemy: {
                    user: {
                        id: 11,
                        name: 'EnemyName',
                        gender: 'm',
                        age: 121,
                        avatars: {
                            s1: 'https://img.beauty.ua/pictures/content/14/14703.jpg',
                            s2: 'https://img.beauty.ua/pictures/content/14/14703.jpg',
                            s3: 'https://img.beauty.ua/pictures/content/14/14703.jpg',
                            s4: 'https://img.beauty.ua/pictures/content/14/14703.jpg',
                            s5: 'https://img.beauty.ua/pictures/content/14/14703.jpg',
                        }
                    },
                    timeLine: {
                        4: 10,
                        8: 20,
                        13: 30,
                        20: 40,
                        24: 35,
                        28: 30,
                        36: 40,
                    }
                },
                states: {
                    GAME_STATE_START: GAME_STATE_START,
                    GAME_STATE_PLAY: GAME_STATE_PLAY,
                    GAME_STATE_FINAL: GAME_STATE_FINAL,
                },
                scaleDecorTop: 1
            }
        },
        created() {
            this.state = GAME_STATE_START;
            this.aim = this.card.card;
        },
        methods:{
            playGame(){
                this.state = GAME_STATE_PLAY;
            },
            gameFinal(){
                this.state = GAME_STATE_FINAL;
            }
        }
    }
</script>
