<template>
    <div class="push-permissions">
        <div class="push-permissions__head">
            <div class="push-permissions__photo" :style="{backgroundImage: `url(${card.avatars.s4})`}"></div>
            <div class="push-permissions__ico">
                <i class="ico ico_bell"></i>
            </div>
        </div>
        <div class="push-permissions__message" v-html="message"></div>
        <button class="btn_secondary btn_size-m btn_mw220" @click="$nav.back()" v-touch>{{$t('push_permission.decline')}}</button>
        <button class="btn_primary btn_size-m btn_mw220" @click="subscribe" v-touch>{{$t('push_permission.accept')}}</button>
    </div>
</template>

<script>
    import bridge from '@/bridge';

    export default {
        name: 'PushPermissions',
        props: ['card'],
        data() {
            return {
                user: this.$store.state.config.user
            }
        },
        computed: {
            message() {
                let gender = this.user.gender === 'm' ? this.$t('push_permission.female') : this.$t('push_permission.male');
                return this.$t('push_permission.message', {
                    my_name: this.user.name,
                    user_name: this.card.name,
                    gender
                });
            }
        },
        methods: {
            subscribe() {
                bridge.invokeNative('push_subscribe');
                this.$nav.back();
            }
        }
    }
</script>
