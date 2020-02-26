<template>
    <div class="my-profile-soft my-profile-soft_vip">
        <div class="my-profile-soft__ico ico ico_crown"></div>
        <div class="my-profile-soft__text">
            <div class="my-profile-soft__title">Premium</div>
            <div class="my-profile-soft__link">Активировать</div>
        </div>
        <div class="my-profile-soft__side">
            <slider-form is-on="true" on-click=""/>
        </div>
    </div>
</template>

<script>
    import SliderForm from './../common/SliderForm';

    export default {
        name: "my-profile-vip",
        components: {SliderForm}
    }
</script>