<template>
    <div class="messenger-contact__message">
        <div class="messenger-contact__message-text ellipsis" v-html="text"></div>
        <div v-if="!isMine && contact.new > 0" class="messenger-contact__count">+{{contact.new}}</div>
        <div v-else-if="isMine && contact.new > 0" class="ico2 ico2_check-read"></div>
    </div>
</template>

<script>
    export default {
        props: ['contact'],
        computed: {
            isMine(){
                return this.contact.lastmess.fromId === 111;
            },
            text() {
                let text = '';

                if (this.isMine){
                    text += 'Вы: ';
                }

                switch (this.type) {
                    case 'image':
                        text += '<div class="ico2 ico2_photo-black-16"></div> Фото';

                        break;
                    default:
                        text += this.contact.lastmess.text;
                }

                return text;
            },
            type() {
                if (!this.contact.lastmess.attaches) {
                    return 'text';
                }

                for (let key in this.contact.lastmess.attaches) if(this.contact.lastmess.attaches.hasOwnProperty(key)){
                    if (this.contact.lastmess.attaches[key].type === 'image') {
                        return 'image';
                    } else {
                        return 'other';
                    }
                }
            }
        }
    };
</script>
