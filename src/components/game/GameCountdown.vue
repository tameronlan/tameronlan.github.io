<template>
    <div
            class="game-popup-countdown"
            :class="{'game-popup-countdown_hidden': timeToStart <= 0}"
    >
        До старта игры:
        <div class="game-popup-countdown__digit">
            {{timeToStart}}
        </div>
    </div>

</template>

<script>
    export default {
        name: "game-countdown",
        props: {
            timeToStart: {
                type: Number,
                default: 3
            }
        }
    }
</script>