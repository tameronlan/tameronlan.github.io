<template>
    <div class="complaint">
        <div class="complaint__title">
            Отправка жалобы
        </div>

        <div class="complaint__helper" v-if="choiceObject !== null">
            Выберите на что хотите пожаловаться
        </div>

        <div class="complaint__helper" v-else>
            Выберите причину жалобы
        </div>

        <template v-if="choiceObject !== null">
            <div class="complaint__list">
                <div class="complaint__item" v-for="complaintSubtype in choiceObject.list" @click="choiceSubtype = complaintSubtype.id" v-touch>
                    {{complaintSubtype.text}}
                </div>
            </div>
        </template>

        <template v-else>
            <div class="complaint__list">
                <div class="complaint__item" v-for="complaintType in complaintsByTypes" @click="choiceType = complaintType.id" v-touch>
                    {{complaintType.text}}
                </div>
            </div>
        </template>

        <div class="popup__close" @click="$nav.back({ignoreUpdate: true})">
            <i class="ico ico_close-gray"></i>
        </div>
    </div>
</template>

<script>
    import {complaint} from "@/api/meeting";

    export default {
        name: "Complaint",
        props: {
            user: {
                type: Object
            },
            type: {
                type: Number
            },
            contentId: {
                type: Number
            },
            popup: {
                type: Object
            }
        },
        data() {
            return {
                complaintsByTypes: {
                    1: {
                        text: 'Photo',
                        id: 1,
                        list: [
                            {
                                id: 1,
                                text: 'Erotic'
                            },
                            {
                                id: 2,
                                text: 'Spam'
                            },
                            {
                                id: 3,
                                text: 'Drug'
                            },

                        ]
                    },
                    2: {
                        text: 'Status',
                        id: 2,
                        list: [
                            {
                                id: 1,
                                text: 'Erotic'
                            },
                            {
                                id: 1,
                                text: 'Erotic'
                            },

                        ]
                    }
                },
                choiceType: 0,
                choiceSubtype: 0,
            }
        },
        created(){
            console.log('popup', this.popup)
        },
        computed: {
            choiceObject(){
                let obj = null;

                if (
                    this.choiceType !== 0
                    && this.complaintsByTypes.hasOwnProperty(this.choiceType)
                ){
                    obj = this.complaintsByTypes[this.choiceType];
                }

                return obj;
            }
        },
        methods: {
            complaintSend() {
                complaint({
                    to_user_id: this.user.id,
                    contentId: this.contentId,
                    type: this.choiceType,
                    subtype: this.choiceSubtype,
                }).then(()=>{
                    // this.$store.dispatch('popups/closePopup', {
                    //     popup: this.popup,
                    //     animated: true
                    // });

                    this.$nav.back();
                    this.$toasted.show('Жалоба отправлена');
                });
            }
        },
        watch: {
            choiceSubtype(){
                this.complaintSend();
            }
        }
    }
</script>
