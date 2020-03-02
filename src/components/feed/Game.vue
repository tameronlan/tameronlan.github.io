<template>
    <div class="game-popup">
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
                    @gameFinal="gameFinal"
            />
        </template>
        <template v-if="state===states.GAME_STATE_WIN">
            <game-win
                    :states="states"
            />
        </template>
        <template v-if="state===states.GAME_STATE_LOSE">
            <game-lose
                    :states="states"
            />
        </template>
    </div>
</template>

<script>
    import GameStart from './GameStart';
    import GamePlay from './GamePlay';
    import GameWin from './GameWin';
    import GameLose from './GameLose';
    import {GAME_STATE_START, GAME_STATE_PLAY, GAME_STATE_WIN, GAME_STATE_LOSE} from '../../consts';

    export default {
        name: "Game",
        components: {GameStart, GamePlay, GameWin, GameLose},
        props: ['card'],
        data(){
            return {
                state: null,
                aim: {},
                enemy: {
                    user: {},
                    timeline: {
                        10: 100,
                        12: 110,
                        25: 2000,
                        55: 2100
                    }
                },
                states: {
                    GAME_STATE_START: GAME_STATE_START,
                    GAME_STATE_PLAY: GAME_STATE_PLAY,
                    GAME_STATE_WIN: GAME_STATE_WIN,
                    GAME_STATE_LOSE: GAME_STATE_LOSE
                }
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
            gameFinal({isWin}){
                this.state = isWin ? GAME_STATE_WIN : GAME_STATE_LOSE;
            }
        }
    }
</script>
