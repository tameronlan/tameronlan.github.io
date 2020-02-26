<template>
    <div class="tutorial">
        <div>
            <div class="tutorial-image"></div>
            <div class="tutorial-content">
                <div class="tutorial-title">Заяви о себе</div>
                <div class="tutorial-text">
                    Природа мужчины — это всегда активные действия, это борьба, преодоление сопротивления, самосовершенствование, завоевание.
                    Можно еще пару строк добавить про всю эту лирику, сильных мужчин и прочее
                </div>
            </div>
        </div>

        <div class="tutorial-next">
            <div class="tutorial-next__btn ripple ripple_lightblue" v-touch @click="next">
                Вперед <div class="ico ico_pointer-right-lightblue-20"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "tutorial",
        mounted(){
            if (localStorage.getItem('tutorial-shown') !== null){
                this.goToFeed();
            }
        },
        data(){
            return {
                image: "/app/img/tutorial.jpg"
            }
        },
        methods: {
            next(){
                localStorage.setItem('tutorial-shown', 1);

                this.goToFeed();
            },
            goToFeed(){
                this.$nav.push('/app/feed');
            }
        }
    }
</script>
