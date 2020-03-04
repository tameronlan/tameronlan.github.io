<template>
    <div
            class="game-popup-final"
            :class="classCover"
    >
        <div class="game-popup-final__lightning"></div>

        <div class="game-popup-final__top">
            <div class="game-popup-final__title">
                {{titlePopup}}
            </div>

            <div class="extend-header__back game-popup-final__back" @click="$nav.back();"><i class="ico ico_close-gray"></i></div>
        </div>

        <div class="game-popup-final__middle">
            <div class="game-popup-final__avatars">
                <template v-if="isWin">
                    <div class="game-popup-final__pairs">
                        <div
                                class="game-popup-final__avatar game-popup-final__avatar_my"
                                :style="{backgroundImage: `url(${currentUser.avatars.s5})`}"
                        ></div>
                        <div
                                class="game-popup-final__avatar"
                                :style="{backgroundImage: `url(${aim.avatars.s5})`}"
                        ></div>
                        <div class="ico ico_feed-like"></div>
                    </div>

                    <div
                            class="game-popup-final__avatar game-popup-final__avatar_enemy"
                            :style="{backgroundImage: `url(${enemy.user.avatars.s5})`}"
                    ></div>
                </template>
                <template v-else>
                    <div
                            class="game-popup-final__avatar game-popup-final__avatar_my"
                            :style="{backgroundImage: `url(${currentUser.avatars.s5})`}"
                    ></div>

                    <div class="game-popup-final__pairs">
                        <div
                                class="game-popup-final__avatar game-popup-final__avatar_enemy"
                                :style="{backgroundImage: `url(${enemy.user.avatars.s5})`}"
                        ></div>
                        <div
                                class="game-popup-final__avatar"
                                :style="{backgroundImage: `url(${aim.avatars.s5})`}"
                        ></div>
                        <div class="ico ico_feed-like"></div>
                    </div>
                </template>
            </div>

            <div class="game-popup-final-scores">
                <div class="game-popup-final-scores__side game-popup-final-scores__side_my">
                    <div class="game-popup-final-scores__name">
                        Вы
                    </div>
                    <div class="game-popup-final-scores__score">
                        {{myScore}}
                    </div>
                </div>

                <div class="game-popup-final-scores__side game-popup-final-scores__side_enemy">
                    <div class="game-popup-final-scores__name">
                        {{enemy.user.name}}
                    </div>
                    <div class="game-popup-final-scores__score">
                        {{enemyScore}}
                    </div>
                </div>
            </div>
        </div>

        <div class="game-popup-final__bottom">
            <template v-if="isWin">
                <div class="btn btn_turquoise ripple_white ripple" v-touch @click="openChat">
                    Написать сообщение
                </div>
            </template>
            <template v-else>
                <div class="btn btn_yellow ripple_white ripple" v-touch @click="openChat">
                    Попросить второй шанс
                </div>
            </template>
            <div class="game-popup-final__or">или</div>
            <div class="game-popup-final__refuse" @click="$nav.back();">
                Отказаться от нее
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import feed from '@/feed/'

    export default {
        name: "final",
        props: {
            boosterAvailable: {
                type: Boolean
            },
            myScore: {
                type: Number
            },
            enemyScore: {
                type: Number
            },
            enemy: {
                type: Object
            },
            aim: {
                type: Object
            }
        },
        computed: {
            isWin(){
                return this.myScore >= this.enemyScore;
            },
            classCover(){
                return this.isWin ? 'game-popup-final_win' : 'game-popup-final_lose';
            },
            titlePopup(){
                return this.isWin ? 'Победа!' : 'Вы проиграли';
            },
            ...mapState(['currentUser'])
        },
        created(){
            console.log(this.boosterAvailable);
        },
        methods: {
            openChat(){
                if (this.boosterAvailable){
                    feed.openSendGift({
                        user: this.aim
                    })
                } else {
                    this.$nav.push('/app/messenger/' + this.aim.id);
                }
            }
        }
    }
</script>