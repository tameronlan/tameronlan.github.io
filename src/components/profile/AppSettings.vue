<template>
    <div class="app-settings extend">
        <div class="extend-header">
            <div class="extend-header__back" @click="$nav.back()"><i class="ico ico_close-gray"></i></div>
            <div class="extend-header__title">{{$t('app_settings.title')}}</div>
        </div>
        <div class="extend-content">
            <div class="app-settings__fields">
                <div class="app-settings__field">
                    <a href="//sites.google.com/view/evermatch/terms-of-use" target="_blank">{{$t('app_settings.field_terms')}}</a>
                </div>
                <div class="app-settings__field">
                    <a href="//sites.google.com/view/evermatch/privacy-policy" target="_blank">{{$t('app_settings.privacy_policy')}}</a>
                </div>
                <div class="app-settings__field">ID: {{me.id}}</div>
                <div v-if="isAdmin" class="app-settings__field" @click="openSettings">Настройки</div>
            </div>
            <div class="app-settings__extra">
                <button class="app-settings__btn-support btn btn_orange ripple ripple_white" @click="openSupport" v-touch>{{$t('app_settings.support')}}
                    <strong v-if="hasSupportAnswer">+1</strong>
                </button>
                <button class="app-settings__btn-remove btn_link" @click="remove">{{$t('app_settings.delete')}}</button>
            </div>
        </div>
    </div>
</template>

<script>
    import feed from '@/feed';
    import bridge from '@/bridge';
    import {mapState, mapGetters} from 'vuex';

    export default {
        name: "AppSettings",
        data() {
            return {
                isAdmin: false,
                me: {}
            }
        },
        computed: {
            mailHref() {
                return `mailto:support@evermatch.me?subject=${this.me.name},%20ID:%20${this.me.id}`;
            },
            ...mapState('vip', ['hasVip', 'status']),
            ...mapGetters('feed', ['hasSupportAnswer'])
        },
        methods: {
            remove() {
                feed.showConfirmPopup({
                    title: this.$t('delete_profile.title'),
                    message: this.$t('delete_profile.message'),
                    btnOk: this.$t('delete_profile.bnt_ok'),
                    btnCancel: this.$t('delete_profile.btn_cancel')
                }).then((params = {}) => {
                    if (params.confirmed) {
                        bridge.invokeNative('logout', {'delete': true, 'source': 'test'});
                    }
                });
            },
            openSettings() {
                bridge.invokeNative('settings');
            },
            openSupport() {
                if (this.isAdmin) {
                    feed.openSupportChat();
                } else {
                    location.href = this.mailHref;
                }
            }
        }
    }
</script>
