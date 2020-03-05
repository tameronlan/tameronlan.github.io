<template>
    <div
            class="incoming-item"
            :class="classes"
            @click="openIncomingForUser"
            v-touch
    >
        <div class="incoming-item__ava-wrapper">
            <div class="incoming-item__ava" :style="{ backgroundImage: `url(${photoUrl})` }">
                <div v-if="item.user.online" class="online-status"></div>
            </div>
        </div>

        <div class="incoming-item__right-side">
            <div class="incoming-item__title">
                <div class="incoming-item__name" v-html="item.user.name"></div>
                <div v-if="item.lastEvent" class="incoming-item__date">
                    {{ date }}
                </div>
            </div>

            <div class="incoming-item__message">
                <div class="incoming-item__message-text ellipsis" v-html="message"></div>
                <div v-if="item.new > 0" class="incoming-item__count">+{{item.new}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import {getSimpleHumanDate} from '@/lib/dateFunctions';

    export default {
        name: "IncomingItem",
        props: {
            item: {
                type: Object
            }
        },
        computed: {
            photoUrl() {
                return this.item.user.avatars.s2;
            },
            date(){
                return getSimpleHumanDate(this.item.lastEvent.time * 1000);
            },
            classes() {
                const classes = [];

                if (this.item.new > 0) {
                    classes.push('incoming-item_unread-theirs');
                } else if (this.item.unread) {
                    classes.push('incoming-item_unread-mine');
                }

                if (this.item.user.online) {
                    classes.push('incoming-item_online');
                }

                return classes;
            },
            message(){
                let message = "";

                switch(this.item.lastEvent.type){
                    case 1:
                        message = "Увидел вас";
                        break;
                    case 2:
                        message = "Посмотрел ваши фотографии";
                        break;
                    case 3:
                        message = "Зашёл в гости";
                        break;
                    case 4:
                        message = "Не захотел добавиться вас";
                        break;
                    case 5:
                        message = "Выйграл вас";
                        break;
                    case 6:
                        message = "Попросил дать ещё шанс ему";
                        break;
                }

                return message;
            }
        },
        methods: {
            openIncomingForUser(){
                this.$nav.push('/app/incoming/' + this.item.user.id);
            }
        }
    }
</script>
