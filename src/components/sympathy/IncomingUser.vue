<template>
    <div class="incoming-user">
        <template v-if="isLoading"></template>
        <template v-else>
            <div class="incoming-user-head">
                <div class="incoming-user-head__button" @click="$nav.back()">
                    <div class="ico ico_arrow-left-blue-24"></div>
                </div>

                <div class="incoming-user-head-user">
                    <div class="incoming-user-head-user__ava-wrapper" @click="openProfile">
                        <div class="incoming-user-head-user__ava" :style="{ backgroundImage: `url(${avaSrc})` }"></div>
                        <div v-if="user.online" class="online"></div>
                    </div>

                    <div class="incoming-user-head-user__name">{{user.name}}</div>
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

            <div class="incoming-user-list">
                <incoming-user-item v-for="(item, index) in list" :user="user" :item="item" :key="index"/>
            </div>
        </template>
    </div>
</template>

<script>
    import ActionsTooltip from '../common/ActionsTooltip';
    import IncomingUserItem from './IncomingUserItem';

    export default {
        name: "incoming-user",
        components: {ActionsTooltip, IncomingUserItem},
        props: {
            incomingItem: {
                type: Object
            }
        },
        computed:{
            avaSrc(){
                return this.user.avatars.s5;
            }
        },
        created(){
            this.loadIncoming();
        },
        data() {
            return {
                isLoading: false,
                isOpeningDialog: false,
                list: [],
                user: {},
                actions: [
                    {
                        label: 'Почистить',
                        id: 1,
                    },
                ]
            };
        },
        methods: {
            onSelectAction(id){
                this.isOpeningDialog = false;
                this.isUploading = true;

                switch (id) {
                    case 1:
                        this.complain();

                        break;
                    case 2:
                        break;
                }
            },
            openProfile(){

            },
            openMenu(){
                this.isOpeningDialog = true;
            },
            loadIncoming(){
                this.isLoading = false;

                this.user = {
                    id: 10,
                    name: 'Name',
                    gander: 'f',
                    online: true,
                    avatars: {
                        s1: "https://sun9-54.userapi.com/c851520/v851520118/1bf303/_ZG4yGzlOQU.jpg?ava=1",
                        s2: "https://sun9-54.userapi.com/c851520/v851520118/1bf303/_ZG4yGzlOQU.jpg?ava=1",
                        s3: "https://sun9-54.userapi.com/c851520/v851520118/1bf303/_ZG4yGzlOQU.jpg?ava=1",
                        s4: "https://sun9-54.userapi.com/c851520/v851520118/1bf303/_ZG4yGzlOQU.jpg?ava=1",
                        s5: "https://sun9-54.userapi.com/c851520/v851520118/1bf303/_ZG4yGzlOQU.jpg?ava=1",
                    }
                };

                this.list = [
                    {
                        userId: 100,
                        type: 1,
                        time: 200
                    },
                    {
                        userId: 10,
                        type: 2,
                        time: 200
                    },
                    {
                        userId: 111,
                        type: 3,
                        time: 200
                    },
                    {
                        userId: 111,
                        type: 4,
                        time: 200
                    },
                ]
            }
        }
    }
</script>