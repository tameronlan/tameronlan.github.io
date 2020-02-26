<template>
    <div class="photo-slider" ref="photoslider">
        <div class="photo-slider__photos">
            <div class="photo-slider__slide" ref="photo1">
                <slide v-if="photo1" :content="photo1"></slide>
            </div>
            <div class="photo-slider__slide" ref="photo2">
                <slide v-if="photo2" :content="photo2"></slide>
            </div>
            <div class="photo-slider__slide" ref="photo3">
                <slide v-if="photo3" :content="photo3"></slide>
            </div>
        </div>
        <div v-if="hasPhotos" class="slider-dots">
            <div
                    v-for="(photo, index) in photos"
                    class="slider-dots__dot"
                    :class="{'slider-dots__dot_active': currentPhotoIndex === index}"
            ></div>
        </div>
    </div>
</template>

<script>
    import Slide from "./Slide";
    import Slider from '@/lib/slider/Slider';
    import SliderDataSourceSet from '@/lib/slider/SliderDataSourceSet';

    export default {
        name: "PhotoSlider",
        props: ['photos', 'slideEl'],
        components: {Slide},
        data() {
            return {
                currentPhotoIndex: 0,
                photo1: null,
                photo2: null,
                photo3: null
            }
        },
        computed: {
            hasPhotos() {
                return this.photos.length > 1;
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.sliderDs = new SliderDataSourceSet({
                    items: this.photos,
                    initialId: this.photos[0].id
                });
                this.slider = new Slider({
                    dataSource: this.sliderDs,
                    el: this.slideEl || this.$refs.photoslider,
                    cardElPrev: this.$refs.photo1,
                    cardElCenter: this.$refs.photo2,
                    cardElNext: this.$refs.photo3,
                    swapObjectInWrapper: this.swapPhoto,
                    didMoveTo: this.didMoveTo,
                    willMoveTo: () => {},
                    onSwipeNext: this.onSwipeNext,
                    onSwipeBack: this.onSwipeBack,
                    direction: Slider.HORIZONTAL
                });

                if (!this.hasPhotos) {
                    this.slider.disable();
                }

            })
        },
        methods: {
            swapPhoto(targetWrapper, photo, position) {
                if (targetWrapper === this.$refs.photo1) {
                    this.photo1 = photo;
                } else if (targetWrapper === this.$refs.photo2) {
                    this.photo2 = photo;
                } else if (targetWrapper === this.$refs.photo3) {
                    this.photo3 = photo;
                }
            },
            didMoveTo({to}) {
                this.currentPhotoIndex = this.photos.indexOf(to);
            },
            onSwipeNext({from, to}) {
                this.onSwap();
            },
            onSwipeBack({from, to}) {
                this.onSwap();
            },
            onSwap() {
                this.$emit('swipe');
            }
        }
    }
</script>
