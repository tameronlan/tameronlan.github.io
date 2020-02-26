<template>
    <div class="filter-settings">
        <div class="filter-settings__back" @click="$emit('close')"></div>
        <div class="filter-settings__content">
            <div class="filter-settings__head">
                {{$t('filter.head')}}
                <button @click="save">{{$t('filter.action')}}</button>
            </div>
            <div class="filter-settings__params">
                <div class="filter-settings__params-title">
                    {{$t('filter.age')}}
                    <span>{{ageRange[0]}}-{{ageRange[1]}}</span>
                </div>
                <vue-slider v-model="ageRange" v-bind="sliderOptions" @change="isChanged = true"/>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex';
    import VueSlider from 'vue-slider-component';

    export default {
        name: "FilterSettings",
        components: {VueSlider},
        data() {
            return {
                ageRange: [0, 100],
                sliderOptions: {
                    dotSize: 20,
                    height: 2,
                    min: 18,
                    max: 100,
                    tooltip: 'none',
                    duration: 0
                },
                isChanged: false
            }
        },
        computed: {
            ...mapState('feed', ['filter']),
        },
        created() {
            this.ageRange[0] = this.filter.age_from;
            this.ageRange[1] = this.filter.age_to;
        },
        methods: {
            save() {
                if (this.isChanged) {
                    this.setFilter({age_from: this.ageRange[0], age_to: this.ageRange[1]});
                }

                this.$emit('close');
            },
            ...mapMutations('feed', ['setFilter'])
        }
    }
</script>
