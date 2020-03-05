<template>
    <div class="messenger-chat-head">
        <div class="messenger-chat-head__button" @click="$nav.back()">
            <div class="ico ico_arrow-left-blue-24"></div>
        </div>

        <div class="messenger-chat-user">
            <div class="messenger-chat-user__ava-wrapper" @click="openProfile">
                <div class="messenger-chat-user__ava" :style="{ backgroundImage: `url(${avaSrc})` }"></div>
                <div v-if="contact.user.online" class="online"></div>
            </div>
            <div class="messenger-chat-user__name">{{contact.user.name}}</div>
        </div>

        <div class="messenger-chat-head__controls">
            <div class="messenger-chat-head__button" @click="openMenu">
                <div class="ico ico_menu-blue-24"></div>
            </div>
        </div>

        <actions-tooltip v-if="isOpeningDialog"
                       :actions="actions"
                       @close="isOpeningDialog = false"
                       @select="onSelectAction"/>
    </div>
</template>

<script>
    import {mapActions} from 'vuex';
    import feed from '@/feed';
    import ActionsTooltip from '../common/ActionsTooltip';

    export default {
        name: 'contact-header',
        components: {ActionsTooltip},
        props: ['contact'],
        data() {
            return {
                isOpeningDialog: false,
                actions: [
                    {
                        label: 'Пожаловаться',
                        id: 1,
                    },
                    {
                        label: 'Удалить контакт',
                        id: 2,
                    },
                    {
                        label: 'Заблокировать пользователя',
                        id: 3,
                    },
                ]
            }
        },
        computed: {
            avaSrc() {
                return this.contact.user.avatars.s1;
            },
        },
        methods: {
            openProfile() {
                feed.openProfile({id: this.contact.id});
            },
            complain() {
                feed.complain(this.contact.user);
            },
            askRemove() {
                if (confirm('Вы действительно хотите удалить контакт и очистить историю переписки?')) {
                    this.removeContact(this.contact.id).then(() => this.$nav.back());
                }
            },
            openMenu(){
                this.isOpeningDialog = true;
            },
            onSelectAction(id){
                this.isOpeningDialog = false;
                this.isUploading = true;

                switch (id) {
                    case 1:
                        this.complain();

                        break;
                    case 2:
                        this.$toasted.show('ACTION FOR DELETE');

                        break;
                    case 3:
                        this.$toasted.show('ACTION FOR BLOCK');

                        break;
                }
            },
            ...mapActions('messenger', ['removeContact']),
        }
    };
</script>
