<template>
    <div class="app__loader">
        <loader/>
        <div class="app__loader-title">
            {{$t('loading_dots')}}
        </div>
    </div>
</template>

<script>
    import Loader from './common/Loader';
    import feed from './../feed/';
    import {mapState, mapGetters} from 'vuex';

    export default {
        name: "start",
        components: {Loader},
        computed: {
            ...mapGetters('feed', ['numNotify']),
            ...mapGetters('common', ['config']),
            ...mapState(['currentUser'])
        },
        data() {
            return {
                isLoading: true
            }
        },
        created() {
            console.log("Start::created");
            console.log(this.config);

            this.$nav.push('/app/feed');
        },
    }
</script>
