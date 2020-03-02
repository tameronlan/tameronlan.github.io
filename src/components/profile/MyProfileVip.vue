<template>
    <div class="my-profile-soft my-profile-soft_vip">
        <div class="my-profile-soft__ico ico ico_crown"></div>
        <div class="my-profile-soft__text">
            <div class="my-profile-soft__title">Premium</div>
            <div class="my-profile-soft__link" @click="showVipPopup">Активировать</div>
        </div>
        <div class="my-profile-soft__side">
            <slider-form is-on="true" @click="showVipPopup"/>
        </div>
    </div>
</template>

<script>
    import SliderForm from './../common/SliderForm';
    import feed from '@/feed/';
    import {SOURCE_VIP_MY_PROFILE} from '@/consts/';

    export default {
        name: "my-profile-vip",
        components: {SliderForm},
        methods: {
            showVipPopup(){
                feed.showVipFullOffer({
                    source: SOURCE_VIP_MY_PROFILE
                })
            }
        }
    }
</script>
