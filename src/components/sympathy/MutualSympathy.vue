<template>
    <div class="mutual-sympathy extend" :class="{'mutual-sympathy_focused': focused}"
         :style="{backgroundImage: `url(${photoUrl})`}">
        <div class="mutual-sympathy__content">
            <div class="mutual-sympathy__title">{{$t('mutual_symp.title')}}</div>
            <div class="mutual-sympathy__sub-title">{{subtitle}}</div>

            <inline-message class="mutual-sympathy__input-wrap" :class="{hidden: messageSend}"
                            @focus="focused = true" @blur="focused = false" @submit="sendMessage"
                            :placeholder="inputPlaceholder"></inline-message>
            <button class="mutual-sympathy__btn-back" @click="$nav.back()">{{$t('mutual_symp.btn')}}</button>
        </div>
        <div v-if="isSending" class="loader-wrap loader-wrap-extend loader-wrap_black">
            <loader :small="true"></loader>
        </div>
    </div>
</template>

<script>
    import {GENDER_MAN} from '../../consts';
    import Loader from '@/components/common/Loader';
    import InlineMessage from '@/components/common/InlineMessage';
    import {postMessage} from '@/api/chat';
    import feed from '@/feed/';

    export default {
        name: "MutualSympathy",
        components: {Loader, InlineMessage},
        props: ['user'],
        data() {
            return {
                focused: false,
                isSending: false,
                messageSend: false
            }
        },
        computed: {
            photoUrl() {
                if (this.user.photos) {
                    return this.user.photo[0]['url'].s5;
                } else {
                    return this.user.avatars.s5;
                }
            },
            subtitle() {
                return this.$t('mutual_symp.subtitle', {name: this.user.name});
            },
            inputPlaceholder() {
                let pronouns = this.isMan ? this.$t('personal_pronouns.him') : this.$t('personal_pronouns.her');
                return this.$t('mutual_symp.placeholder', {pronouns: pronouns});
            },
            isMan() {
                return this.user.gender === GENDER_MAN;
            }
        },
        methods: {
            sendMessage(message) {
                this.isSending = true;
                postMessage({
                    contactId: this.user.id,
                    message: message
                }).then(response => {
                    this.messageSend = true;
                    this.$push.emit('notification', {
                        data: {
                            text: this.$t('notification.msg'),
                            ava: this.user.avatars.s1,
                            style: 'yellow'
                        }
                    });
                }).catch(error => {
                    feed.showMessageLimit(this.user);
                }).finally(() => {
                    this.isSending = false;
                });
            }
        }
    }
</script>
