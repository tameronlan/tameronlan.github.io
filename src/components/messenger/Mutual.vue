<template>
    <div class="mutual">
        <div class="mutual__title" v-if="counters.events.mutual > 0">{{$t('mutual.title_new')}} <span v-if="counters.events.mutual > 0">+{{counters.events.mutual}}</span>
        </div>
        <div class="mutual__title" v-else>{{$t('mutual.title')}}</div>
        <div class="mutual__content">
            <div v-if="isLoading && list.length == 0" class="loader-wrap loader-wrap-inside">
                <loader :extraSmall="true"></loader>
            </div>
            <div v-else-if="list.length > 0" class="mutual__list">
                <mutual-item
                        v-for="(item, index) in list"
                        :key="item.id"
                        :item="item"
                        @click.native="openContact(item)"
                />
            </div>
            <div v-else class="mutual__empty">
                {{$t('mutual.empty')}}
            </div>
        </div>
    </div>
</template>

<script>
    import MutualItem from './MutualItem';
    import {getPairs, read} from '@/api/events';
    import {mapState, mapMutations} from 'vuex';
    import feed from '@/feed';
    import EventBus from "../../lib/EventBus";
    import Loader from '@/components/common/Loader';

    export default {
        name: "Mutual",
        components: {Loader, MutualItem},
        data() {
            return {
                isLoading: false,
                list: []
            }
        },
        computed: {
            ...mapState('feed', ['counters'])
        },
        created() {
            this.loadPairs();

            EventBus.$on('updateCouple', this.updateCouple);
            EventBus.$on('removeCouple', this.removeItem);
        },
        beforeDestroy() {
            EventBus.$off('updateCouple', this.updateCouple);
            EventBus.$off('removeCouple', this.removeItem);
        },
        methods: {
            loadPairs() {
                this.isLoading = true;
                getPairs({
                    offset: 0,
                    include: 'user',
                    limit: 100
                }).then(response => {
                    this.list = response.objects;
                    this.isLoading = false;
                });
            },
            openContact(item) {
                this.markAsRead(item);

                this.$nav.push('/app/messenger/' + item.user.id);
            },
            removeItem(id) {
                this.list = this.list.filter(listItem => listItem.user.id !== id);
            },
            updateCouple(user) {
                let item = this.list.find(listItem => listItem.user.id === user.id);
                if (item) {
                    item.new = user.new;
                }
            },
            markAsRead(item) {
                item.new = 0;

                if (!item.is_read) {
                    item.is_read = true;
                    read(item.user.id);
                    this.decreaseEventsCounter('mutual');
                }
            },
            ...mapMutations('feed', ['decreaseEventsCounter'])
        }
    }
</script>
