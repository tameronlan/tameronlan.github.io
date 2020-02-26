<template>
    <div class="confirm-close-discount" :class="{shown: shown}">
        <div class="confirm-close-discount__popup">
            <div class="confirm-close-discount__title">{{$t('discount_close.title')}}</div>
            <button class="btn_secondary btn_size-m" @click="okClick" v-touch>{{$t('discount_close.confirm')}}</button>
            <button class="btn_primary btn_size-m" @click="cancelClick" v-touch>
                {{$t('discount_close.reject', {count: discount})}}
                <div class="confirm-close-discount__countdown">{{countdown}}</div>
            </button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ConfirmCloseDiscount',
        props: ['countdown', 'discount'],
        data() {
            return {
                shown: false
            }
        },
        mounted() {
            setTimeout(() => {
                this.shown = true;
            }, 100);
        },
        methods: {
            okClick() {
                this.$emit('confirm');
            },
            cancelClick() {
                this.shown = false;
                setTimeout(() => {
                    this.$emit('reject');
                }, 400);
            }
        }
    }
</script>
