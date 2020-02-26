<template>
    <div class="waiter-popup__container">
        <div class="waiter-popup__top">
            <div class="waiter-popup-user">
                <div class="waiter-popup-user__ava" style="background-image: url(https://sun9-10.userapi.com/c851320/v851320058/1386fd/Zrp4BcCGR8U.jpg)"></div>
                <div class="waiter-popup-user__shadow"></div>
                <div class="waiter-popup-user__name ellipsis">
                    asdasdkjahs djkahd asdjas dkjashd ajsdkah
                </div>
            </div>

            <div class="waiter-popup__text">
                захотела, чтобы вы обратили на нее внимание
            </div>
        </div>
        <div class="waiter-popup__bottom">
            <div class="waiter-popup__btn btn btn_purple" v-touch>
                <div class="ico ico_heart"></div>
                Побороться за неё
            </div>

            <span class="waiter-popup__link" @click="$nav.back()">
                Не сейчас
            </span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "get-waiter-popup"
    }
</script>