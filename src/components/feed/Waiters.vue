<template>
    <div @click="showGetWaiter" :class="containerClasses">
        <div class="waiters__progress">
            {{titleProgress}}
        </div>
        <div class="waiters__motivator">
            <div class="waiters__users" v-if="false">
                <div class="waiters-user waiters-user_empty">
                    <div class="ico ico_question-blue"></div>
                </div>
            </div>
            <div class="waiters__users" v-else>
                <div class="waiters-user waiters-user_current">
                    <svg class="waiters-user__progress" width="60" height="60" viewBox="0 0 60 60">
                        <circle class="waiters-user__circle" stroke="6" r="27" cx="30" cy="30"></circle>
                        <circle class="waiters-user__circle waiters-user__circle_current" stroke="6" r="27" cx="30" cy="30" style="stroke-dasharray: 87.96459430051421; stroke-dashoffset: 85.73615791156784;"></circle>
                    </svg>
                </div>
                <div class="waiters-user"></div>
                <div class="waiters-user"></div>
            </div>
            {{titleMotivation}}
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import feed from '@/feed/';

    export default {
        name: "waiters",
        data(){
            return {
                aimCountCards: 25,

                waiters: [
                    {
                        id: 1,
                        name: 'Name',
                        gender: 'f',
                        countFor: 25,
                        avatars: {
                            's': 'https://sun9-38.userapi.com/c858032/v858032599/128d97/P7hNkmD0F70.jpg'
                        }
                    },
                    {
                        id: 1,
                        name: 'Name',
                        gender: 'f',
                        countFor: 25,
                        avatars: {
                            's': 'https://sun9-38.userapi.com/c858032/v858032599/128d97/P7hNkmD0F70.jpg'
                        }
                    }
                ]
            }
        },
        computed: {
            containerClasses(){
                let classes = ['waiters'];

                if(this.waiters.length === 0){
                    classes.push('waiters_empty');
                }

                return classes;
            },
            titleProgress(){
                let resultString = "";

                if (this.aimCountCards > 0){
                    let aimCardsText = this.$t('waiters.aim_cards_count', { count: this.aimCountCards });

                    resultString = this.waiters.length ?
                        this.$t('waiters.progress_aim', {
                            aim: this.waiters[0].gender === 'm' ? this.$t('for_him') : this.$t('for_her'),
                            aim_distance: aimCardsText
                        }):
                        this.$t('waiters.progress_empty',{
                            aim_distance: aimCardsText
                        })
                }

                return resultString;
            },
            titleMotivation(){
                return this.waiters.length ? this.$t('waiters.watch_all') : this.$t('waiters.watch_vip');
            },
            ...mapState('feed', ['viewedCards'])
        },
        watch: {
            viewedCards(count){
            }
        },
        methods: {
            showWaiters(){
                feed.showWaiters();
            },
            showGetWaiter(){
                feed.showGetWaiter();
            }
        }
    }
</script>
