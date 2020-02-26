<template>
    <div class="steps-progress">
        <div class="steps-progress__title">{{current}}/{{total}}</div>
        <div class="steps-progress__bar">
            <div class="steps-progress__step"
                 v-for="n in total"
                 :class="{'steps-progress__step-current': current >= n}"
                 :key="n">
                <div class="steps-progress__dot"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'StepsProgress',
        props: ['current', 'total']
    }
</script>
