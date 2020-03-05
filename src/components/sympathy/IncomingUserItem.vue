<template>
    <div :class="classes">
        <div class="incoming-user-item__bubble">
            <div class="incoming-user-item__text" v-html="text"></div>
            <div class="incoming-user-item__link" v-html="link"></div>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "incoming-user-item",
        props: {
            item: {
                type: Object
            },
            user: {
                type: Object
            }
        },
        computed: {
            isMine(){
                console.log(this.currentUser.id);

                return this.currentUser.id === this.item.userId;
            },
            classes(){
                let classes = ['incoming-user-item'];

                if (this.isMine){
                    classes.push('incoming-user-item_mine');
                }

                return classes;
            },
            text(){
                let text = '';

                switch(this.item.type){
                    case 1:
                        text = 'Первый тип сигнала отправляемого от пользователя';
                        break;
                    case 2:
                        text = 'Второй тип сигнала отправляемого от пользователя';
                        break;
                    case 3:
                        text = 'Третий тип сигнала отправляемого от пользователя';
                        break;
                    case 4:
                        text = 'Четвёртый тип сигнала отправляемого от пользователя';
                        break;
                    case 5:
                        text = 'Пятый тип сигнала отправляемого от пользователя';
                        break;
                }

                return text;
            },
            link(){
                let link = '';

                switch(this.item.type){
                    case 1:
                        link = 'Ссылка первого типа';
                        break;
                    case 2:
                        link = 'Ссылка второго типа';
                        break;
                    case 3:
                        link = 'Ссылка третьего типа';
                        break;
                    case 4:
                        link = 'Ссылка четвёртого типа';
                        break;
                    case 5:
                        link = 'Ссылка пятого типа';
                        break;
                }

                return link;
            },
            ...mapState(['currentUser'])
        }
    }
</script>
