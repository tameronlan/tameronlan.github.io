<template>
    <div :class="sliderClasses" @click="trigger">
        <div class="slider__circle"></div>
    </div>
</template>

<script>
    export default {
        name: "slider-form",
        props: ['onClick', 'isOn'],
        data() {
            return {
                isActive: this.isOn
            }
        },
        computed: {
            sliderClasses(){
                let classes = ['slider'];

                if (this.isActive){
                    classes.push('slider_on')
                }

                return classes;
            }
        },
        methods: {
            trigger(){
                this.isActive = !this.isActive;

                if (this.onClick){
                    this.onClick(this.isActive);
                }
            }
        }
    }
</script>