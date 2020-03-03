<template>
    <div class="game-popup-play-booster"
         :class="{'game-popup-play-booster_disabled': (boosterSecondsFromLastUsedTime < boosterRecoveryTime)}"
    >
        <div class="game-popup-play-booster__circle" v-touch @click="$emit('activeBooster')">
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
                <div class="game-popup-play-booster__points">+{{boosterPoints}}</div>
            </div>
        </div>

        <div v-if="boosterSecondsFromLastUsedTime < boosterRecoveryTime" class="game-popup-play-booster__title">
            {{boosterRecoveryTime - boosterSecondsFromLastUsedTime}} сек
        </div>

        <div v-else class="game-popup-play-booster__title">Бустер</div>
    </div>
</template>

<script>
    import CircleProgress from '@/components/common/CircleProgress';

    export default {
        name: "game-booster",
        props: {
            boosterSecondsFromLastUsedTime: {
                type: Number,
                default: 25
            }
        },
        data(){
            return {
                boosterRecoveryTime: 25,
                boosterPoints: 25
            }
        },
        components: {
            CircleProgress,
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
