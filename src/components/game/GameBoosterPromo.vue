<template>
    <div class="game-popup-play-booster-promo">
        <div class="game-popup-play-booster-promo__icon">
            <div class="ico2 ico2_booster-promo-heart">
            </div>
            <div class="game-popup-play-booster-promo__points">+{{boosterPoints}}</div>
            <div class="game-popup-play-booster-promo__title">VIP</div>
        </div>

        С VIP вы можете получить +{{boosterPoints}} очков каждые {{boosterRecoveryTime}} секунд
    </div>
</template>

<script>
    export default {
        name: "game-booster-promo",
        props: {
            boosterPoints: {
                type: Number
            },
            boosterRecoveryTime: {
                type: Number
            }
        },
    }
</script>
