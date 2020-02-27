<template>
    <div class="send-gift">
        <template v-if="step==='choice'">
            <div class="send-gift-head">
                <div class="send-gift-head__button" @click="$nav.back()">
                    <div class="ico ico_arrow-left-white-24"></div>
                </div>
                <div class="send-gift-head__aim">
                    <div class="send-gift-aim">
                        <div class="send-gift-aim__ava" :style="{backgroundImage: `url(${user.avatars.s1})`}"></div>
                        <div class="send-gift-aim__fio">
                            {{user.name + (!user.age ? '' : `, ${user.age}`)}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="send-gift__content">
                <div class="send-gift__list">
                    <div v-for="gift in gifts" class="send-gift__item" @click="choiceGift(gift)">
                        <div :style="{backgroundImage: `url(${gift.urls[150]})`}" class="send-gift__img"></div>
                    </div>
                </div>
            </div>
        </template>
        <template v-else-if="step==='subscribe'">
            <div class="send-gift-subscribe__back" @click="backToList">
                <div class="ico ico_arrow-left-white-24"></div>
            </div>

            <div class="send-gift-subscribe__content">
                <div class="send-gift-subscribe__title">
                    Натаща будет впечатлена
                    вашим подарком!
                </div>

                <div class="send-gift-subscribe__gift">
                    <div class="send-gift-subscribe__aim" :style="{backgroundImage: `url(${user.avatars.s1})`}"></div>
                    <img class="send-gift-img" :src="giftChoiced.urls[150]"/>
                </div>

                <div class="send-gift-subscribe__field">
                    <div class="send-gift-subscribe__hidden-text" v-html="textHidden"></div>
                    <textarea
                            class="send-gift-subscribe__text text-field"
                            placeholder="Подпишите подарок"
                            @input="text = $event.target.value"
                    ></textarea>
                </div>

                <button class="send-gift-subscribe__btn ripple ripple_white btn btn_orange" v-touch>Отправить подарок</button>
            </div>
        </template>
    </div>
</template>

<script>
    export default {
        name: "send-gift",
        props: ['gift', 'user'],
        data(){
            let startId = 14611;

            let gifts = new Array(30).fill({}).map((item, index) => {
                let id = startId + index;
                let pref = String(id).slice(0,3);


                return {
                    id: id,
                    title: `Gift ${id}`,
                    urls: {
                        150: `https://st.fotocdn.net/images/gifts/${pref}/${id}/150.png`,
                        100: `https://st.fotocdn.net/images/gifts/${pref}/${id}/100.png`,
                        50: `https://st.fotocdn.net/images/gifts/${pref}/${id}/50.png`,
                    }
                };
            });

            return {
                gifts,
                giftChoiced: null,
                step: 'choice',
                textHidden: '',
                text: ''
            }
        },
        mounted(){
        },
        methods: {
            choiceGift(gift){
                this.giftChoiced = gift;
                this.step = 'subscribe';
            },
            backToList(){
                this.step = 'choice';
                this.giftChoiced = null;
            }
        },
        watch: {
            text(val){
                console.log(val);
                this.textHidden = val.replace(new RegExp('\n', 'g'), '<br/>&nbsp;');
            },
        }
    }
</script>

<style scoped>

</style>