<template>
    <div class="signup-step__back ripple ripple_white" @click="back">
        <div class="ico ico_arrow-left-white-24"></div>
    </div>
</template>

<script>
    export default {
        name: "signup-step-back",
        methods: {
            back(){
                this.$nav.go(-1);
            }
        }
    }
</script>